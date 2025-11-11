import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, TextInput, Modal, Pressable, useWindowDimensions } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api/client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollContainer } from '../components/ScrollContainer'

// Tipos de datos
export type User = { id: number; email: string; full_name: string; role: 'admin' | 'user'; created_at?: string };
export type UsersPaged = { items: User[]; total: number };

// Filtros y orden
type RoleFilter = 'all' | 'admin' | 'user';
type SortBy = 'id' | 'email' | 'full_name' | 'role';
type SortOrder = 'asc' | 'desc';

// Validaciones de formularios
const createSchema = z.object({
  email: z.string().email('Email inválido'),
  full_name: z.string().min(1, 'Nombre obligatorio'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  role: z.enum(['admin', 'user'], { errorMap: () => ({ message: 'Rol inválido' }) })
});

const updateSchema = z.object({
  email: z.string().email('Email inválido').optional(),
  full_name: z.string().min(1, 'Nombre obligatorio').optional(),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').optional(),
  role: z.enum(['admin', 'user'], { errorMap: () => ({ message: 'Rol inválido' }) }).optional()
});

export default function AdminUsersScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const { width } = useWindowDimensions();
  const isSmall = width < 420;
  const colStyles = useMemo(() => ({
    email: { minWidth: isSmall ? 220 : 280 },
    full_name: { minWidth: isSmall ? 200 : 260 },
    role: { minWidth: isSmall ? 120 : 140 },
    created_at: { minWidth: isSmall ? 200 : 240 },
    actions: { minWidth: isSmall ? 240 : 280 }
  }), [isSmall]);

  // Estado principal
  const [q, setQ] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<RoleFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [limit, setLimit] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(0);

  const [items, setItems] = useState<User[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Modales
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Guard: solo admin
  useEffect(() => {
    if (!user) return;
    if (user.role !== 'admin') {
      alert('No autorizado');
      navigation.navigate('Profile');
    }
  }, [user]);

  // Construcción de params de consulta (evita enviar role si es "all")
  const queryParams = useMemo(() => {
    const params: any = {
      limit,
      offset: pageIndex * limit,
      sortBy: sortBy || 'id',
      sortOrder: sortOrder || 'asc'
    };
    if (q.trim()) params.q = q.trim();
    if (fullName.trim()) params.full_name = fullName.trim();
    if (role !== 'all') params.role = role;
    return params;
  }, [q, fullName, role, sortBy, sortOrder, limit, pageIndex]);

  // Debounce de 300ms para búsquedas y filtros
  useEffect(() => {
    let cancelled = false;
    const h = setTimeout(async () => {
      if (cancelled) return;
      setLoading(true);
      setErrorMsg(null);
      try {
        const { data } = await api.get<UsersPaged>('/admin/users/paged', { params: queryParams });
        setItems(Array.isArray(data.items) ? data.items : []);
        setTotal(typeof data.total === 'number' ? data.total : 0);
      } catch (e: any) {
        const status = e?.response?.status;
        const serverMsg = e?.response?.data?.detail || e?.message || 'Error inesperado';
        setErrorMsg(serverMsg);
        if (status === 401) {
          // interceptor ya hace logout; navegación se actualiza automáticamente
        } else if (status === 403) {
          alert('No autorizado. Redirigiendo a inicio de sesión');
          await logout();
          navigation.navigate('Login');
        } else {
          alert(`Error al cargar usuarios: ${serverMsg}`);
        }
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(h);
    };
  }, [queryParams, refreshKey]);

  // Ordenamiento al clicar encabezados
  const toggleSort = (column: SortBy) => {
    setPageIndex(0);
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Paginación
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const canPrev = pageIndex > 0;
  const canNext = pageIndex + 1 < totalPages;

  const goPrev = () => { if (canPrev) setPageIndex(pageIndex - 1); };
  const goNext = () => { if (canNext) setPageIndex(pageIndex + 1); };

  // Acciones: Ver detalle
  const openDetail = async (id: number) => {
    setShowDetail(true);
    setDetailLoading(true);
    setDetailUser(null);
    try {
      const { data } = await api.get<User>(`/admin/users/${id}`);
      setDetailUser(data);
    } catch (e: any) {
      const serverMsg = e?.response?.data?.detail || e?.message || 'Error al cargar detalle';
      alert(serverMsg);
    } finally {
      setDetailLoading(false);
    }
  };

  // Acciones: Crear usuario
  const CreateUserModal: React.FC<{ visible: boolean; onClose: () => void; onCreated: () => void }> = ({ visible, onClose, onCreated }) => {
    const { register, handleSubmit, setValue, formState: { errors, isSubmitting }, reset } = useForm<z.infer<typeof createSchema>>({ resolver: zodResolver(createSchema) });
    const firstInputRef = useRef<TextInput>(null);
    useEffect(() => { if (visible) setTimeout(() => firstInputRef.current?.focus(), 100); }, [visible]);
    useEffect(() => { register('email'); }, [register]);

    const onSubmit = async (data: z.infer<typeof createSchema>) => {
      try {
        await api.post<User>('/admin/users', data);
        onClose();
        reset();
        onCreated();
      } catch (e: any) {
        const serverMsg = e?.response?.data?.detail || e?.message || 'Error al crear usuario';
        alert(serverMsg);
      }
    };

    return (
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Crear usuario</Text>
            <View style={styles.formRow}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                ref={firstInputRef}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={(t) => setValue('email', t)}
              />
              {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
            </View>
            <View style={styles.formRow}>
              <Text style={styles.label}>Nombre completo</Text>
              <TextInput style={styles.input} onChangeText={(t) => setValue('full_name', t)} {...register('full_name')} />
              {errors.full_name && <Text style={styles.error}>{errors.full_name.message}</Text>}
            </View>
            <View style={styles.formRow}>
              <Text style={styles.label}>Contraseña</Text>
              <TextInput style={styles.input} secureTextEntry onChangeText={(t) => setValue('password', t)} {...register('password')} />
              {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
            </View>
            <View style={styles.formRow}>
              <Text style={styles.label}>Rol</Text>
              <View style={styles.roleRow}>
                {(['admin','user'] as const).map(r => (
                  <Pressable key={r} style={[styles.pill, styles.pillPrimary]} onPress={() => setValue('role', r)}>
                    <Text style={styles.pillText}>{r}</Text>
                  </Pressable>
                ))}
              </View>
              {errors.role && <Text style={styles.error}>{errors.role.message}</Text>}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={onClose} disabled={isSubmitting}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
                {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Crear</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // Acciones: Editar usuario
  const EditUserModal: React.FC<{ visible: boolean; user: User | null; onClose: () => void; onUpdated: () => void }> = ({ visible, user, onClose, onUpdated }) => {
    const { register, handleSubmit, setValue, formState: { errors, isSubmitting }, reset } = useForm<z.infer<typeof updateSchema>>({ resolver: zodResolver(updateSchema) });
    const firstInputRef = useRef<TextInput>(null);
    useEffect(() => {
      if (visible && user) {
        reset({ email: user.email, full_name: user.full_name, role: user.role });
        setTimeout(() => firstInputRef.current?.focus(), 100);
      }
    }, [visible, user]);
    useEffect(() => { register('email'); }, [register]);

    const onSubmit = async (data: z.infer<typeof updateSchema>) => {
      if (!user) return;
      try {
        await api.put<User>(`/admin/users/${user.id}`, data);
        onClose();
        onUpdated();
      } catch (e: any) {
        const serverMsg = e?.response?.data?.detail || e?.message || 'Error al actualizar usuario';
        alert(serverMsg);
      }
    };

    return (
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar usuario</Text>
            <View style={styles.formRow}>
              <Text style={styles.label}>Email</Text>
              <TextInput ref={firstInputRef} style={styles.input} autoCapitalize="none" keyboardType="email-address" onChangeText={(t) => setValue('email', t)} />
              {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
            </View>
            <View style={styles.formRow}>
              <Text style={styles.label}>Nombre completo</Text>
              <TextInput style={styles.input} onChangeText={(t) => setValue('full_name', t)} {...register('full_name')} />
              {errors.full_name && <Text style={styles.error}>{errors.full_name.message}</Text>}
            </View>
            <View style={styles.formRow}>
              <Text style={styles.label}>Nueva contraseña (opcional)</Text>
              <TextInput style={styles.input} secureTextEntry onChangeText={(t) => setValue('password', t)} {...register('password')} />
              {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
            </View>
            <View style={styles.formRow}>
              <Text style={styles.label}>Rol</Text>
              <View style={styles.roleRow}>
                {(['admin','user'] as const).map(r => (
                  <Pressable key={r} style={[styles.pill, (user?.role === r ? styles.pillPrimary : styles.pillSecondary)]} onPress={() => setValue('role', r)}>
                    <Text style={styles.pillText}>{r}</Text>
                  </Pressable>
                ))}
              </View>
              {errors.role && <Text style={styles.error}>{errors.role.message}</Text>}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={onClose} disabled={isSubmitting}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
                {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Guardar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // Acciones: Eliminar
  const ConfirmDeleteDialog: React.FC<{ id: number | null; onCancel: () => void; onDeleted: () => void }> = ({ id, onCancel, onDeleted }) => {
    const visible = id !== null;
    const onConfirm = async () => {
      if (!id) return;
      setDeleteLoading(true);
      try {
        await api.delete(`/admin/users/${id}`);
        onCancel();
        onDeleted();
      } catch (e: any) {
        const serverMsg = e?.response?.data?.detail || e?.message || 'Error al eliminar usuario';
        alert(serverMsg);
      } finally {
        setDeleteLoading(false);
      }
    };
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Confirmar eliminación</Text>
            <Text>¿Seguro que deseas eliminar al usuario {id ?? ''}?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={onCancel} disabled={deleteLoading}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.buttonDanger]} onPress={onConfirm} disabled={deleteLoading}>
                {deleteLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Eliminar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // Barra de filtros
  const FiltersBar: React.FC = () => (
    <View style={styles.filtersBar}>
      <View style={styles.filterItem}>
        <Text style={styles.label}>Buscar por email</Text>
        <TextInput placeholder="Email" style={styles.input} value={q} onChangeText={(t) => { setQ(t); setPageIndex(0); }} autoCapitalize="none" />
      </View>
      <View style={styles.filterItem}>
        <Text style={styles.label}>Buscar por nombre completo</Text>
        <TextInput placeholder="Nombre" style={styles.input} value={fullName} onChangeText={(t) => { setFullName(t); setPageIndex(0); }} />
      </View>
      <View style={styles.filterItem}>
        <Text style={styles.label}>Rol</Text>
        <View style={styles.roleRow}>
          {(['all','admin','user'] as const).map(r => (
            <Pressable key={r} style={[styles.pill, role === r ? styles.pillPrimary : styles.pillSecondary]} onPress={() => { setRole(r); setPageIndex(0); }}>
              <Text style={styles.pillText}>{r === 'all' ? 'Todos' : r}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.filterActions}>
        <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={() => { setQ(''); setFullName(''); setRole('all'); setSortBy('id'); setSortOrder('asc'); setLimit(10); setPageIndex(0); }}>
          <Text style={styles.buttonText}>Reset filtros</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={() => setShowCreate(true)}>
          <Text style={styles.buttonText}>Crear usuario</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Tabla de usuarios (lista con encabezados clicables)
  const UsersTable: React.FC = () => (
    <ScrollContainer style={styles.screen} contentContainerStyle={styles.container}>
      <View style={[styles.table, { minWidth: isSmall ? 980 : 1200 }] }>
        <View style={styles.tableHeader}>
          <TouchableOpacity style={[styles.th, colStyles.email]} onPress={() => toggleSort('email')}><Text style={styles.thText}>Email {sortBy==='email' ? (sortOrder==='asc'?'▲':'▼') : ''}</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.th, colStyles.full_name]} onPress={() => toggleSort('full_name')}><Text style={styles.thText}>Nombre completo {sortBy==='full_name' ? (sortOrder==='asc'?'▲':'▼') : ''}</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.th, colStyles.role]} onPress={() => toggleSort('role')}><Text style={styles.thText}>Rol {sortBy==='role' ? (sortOrder==='asc'?'▲':'▼') : ''}</Text></TouchableOpacity>
          <View style={[styles.th, colStyles.created_at]}><Text style={styles.thText}>Fecha de creación</Text></View>
          <View style={[styles.th, colStyles.actions]}><Text style={styles.thText}>Acciones</Text></View>
        </View>
        {loading ? (
          <View style={styles.center}><ActivityIndicator /></View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <View style={styles.tr}>
                <View style={[styles.td, colStyles.email]}><Text numberOfLines={1}>{item.email}</Text></View>
                <View style={[styles.td, colStyles.full_name]}><Text numberOfLines={1}>{item.full_name}</Text></View>
                <View style={[styles.td, colStyles.role]}><Text>{item.role}</Text></View>
                <View style={[styles.td, colStyles.created_at]}><Text>{item.created_at ? new Date(item.created_at).toLocaleString() : '-'}</Text></View>
                <View style={[styles.td, styles.actions, colStyles.actions]}>
                  <TouchableOpacity style={[styles.smallBtn, styles.smallBtnInfo]} onPress={() => openDetail(item.id)}>
                    <Text style={styles.smallBtnText}>Ver</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.smallBtn, styles.smallBtnPrimary]} onPress={() => { setEditingUser(item); setShowEdit(true); }}>
                    <Text style={styles.smallBtnText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.smallBtn, styles.smallBtnDanger]} onPress={() => setDeleteId(item.id)}>
                    <Text style={styles.smallBtnText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={<View style={styles.center}><Text>No hay usuarios</Text></View>}
            scrollEnabled={false}
          />
        )}
      </View>
    </ScrollContainer>
  );
 
   // Controles de paginación
  const PaginationControls: React.FC = () => (
    <View style={styles.pagination}>
      <View style={styles.paginationLeft}>
        <Text style={styles.label}>Tamaño de página</Text>
        <View style={styles.roleRow}>
          {[10,20,50].map(n => (
            <Pressable key={n} style={[styles.pill, limit===n?styles.pillPrimary:styles.pillSecondary]} onPress={() => { setLimit(n); setPageIndex(0); }}>
              <Text style={styles.pillText}>{n}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.paginationRight}>
        <TouchableOpacity style={[styles.smallBtn, !canPrev && styles.smallBtnDisabled]} disabled={!canPrev} onPress={goPrev}>
          <Text style={styles.smallBtnText}>{'< Anterior'}</Text>
        </TouchableOpacity>
        <Text style={{ marginHorizontal: 8 }}>Página {pageIndex + 1} de {totalPages}</Text>
        <TouchableOpacity style={[styles.smallBtn, !canNext && styles.smallBtnDisabled]} disabled={!canNext} onPress={goNext}>
          <Text style={styles.smallBtnText}>{'Siguiente >'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollContainer style={styles.screen} contentContainerStyle={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <Text style={styles.title}>Administración de Usuarios</Text>
        <TouchableOpacity style={[styles.smallBtn, styles.smallBtnDanger]} onPress={logout}>
          <Text style={styles.smallBtnText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
      <FiltersBar />
      <UsersTable />
      <PaginationControls />
      {/* Modales y detalle se mantienen */}
      <CreateUserModal visible={showCreate} onClose={() => setShowCreate(false)} onCreated={() => { setPageIndex(0); setRefreshKey((k) => k + 1); }} />
      <EditUserModal visible={showEdit} user={editingUser} onClose={() => { setShowEdit(false); setEditingUser(null); }} onUpdated={() => { setPageIndex(0); setRefreshKey((k) => k + 1); }} />
      <ConfirmDeleteDialog id={deleteId} onCancel={() => setDeleteId(null)} onDeleted={() => { setPageIndex(0); setRefreshKey((k) => k + 1); }} />

      {/* Modal de detalle */}
      <Modal visible={showDetail} animationType="slide" transparent onRequestClose={() => setShowDetail(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Detalle de usuario</Text>
            {detailLoading ? (
              <View style={styles.center}><ActivityIndicator /></View>
            ) : detailUser ? (
              <View>
                <Text>ID: {detailUser.id}</Text>
                <Text>Email: {detailUser.email}</Text>
                <Text>Nombre: {detailUser.full_name}</Text>
                <Text>Rol: {detailUser.role}</Text>
                {detailUser.created_at && <Text>Creado: {new Date(detailUser.created_at).toLocaleString()}</Text>}
              </View>
            ) : (
              <Text>No se pudo cargar el detalle.</Text>
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={() => setShowDetail(false)}>
                <Text style={styles.buttonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { padding: 20 },
  center: { justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'left' },
  filtersBar: { marginBottom: 12 },
  filterItem: { marginBottom: 8 },
  label: { fontWeight: '600', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
  roleRow: { flexDirection: 'row', gap: 8 },
  pill: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1 },
  pillPrimary: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  pillSecondary: { backgroundColor: '#f1f5f9', borderColor: '#cbd5e1' },
  pillText: { color: '#111827' },
  filterActions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  button: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 8 },
  buttonPrimary: { backgroundColor: '#2563eb' },
  buttonSecondary: { backgroundColor: '#334155' },
  buttonDanger: { backgroundColor: '#ef4444' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  table: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f9fafb', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  th: { flex: 1, paddingVertical: 10, paddingHorizontal: 8 },
  thText: { fontWeight: '700' },
  tr: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', alignItems: 'center' },
  td: { flex: 1, paddingVertical: 10, paddingHorizontal: 8 },
  actions: { flexDirection: 'row', gap: 6, justifyContent: 'flex-end' },
  smallBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, backgroundColor: '#64748b' },
  smallBtnText: { color: '#fff' },
  smallBtnInfo: { backgroundColor: '#0ea5e9' },
  smallBtnPrimary: { backgroundColor: '#2563eb' },
  smallBtnDanger: { backgroundColor: '#ef4444' },
  smallBtnDisabled: { backgroundColor: '#cbd5e1' },
  pagination: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  paginationLeft: { flexDirection: 'column' },
  paginationRight: { flexDirection: 'row', alignItems: 'center' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '90%', backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  formRow: { marginBottom: 10 },
  error: { color: 'red', marginTop: 4 }
});