import { StyleSheet } from 'react-native';
import { LegalTheme } from '../constants/legaltheme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: LegalTheme.colors.background,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 220,
    height: 60,
    resizeMode: 'contain',
  },
  formCard: {
    backgroundColor: LegalTheme.colors.surface,
    borderRadius: LegalTheme.borderRadius.medium,
    paddingVertical: 20,
    paddingHorizontal: 16,
    ...LegalTheme.shadows.large,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: LegalTheme.colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: LegalTheme.colors.border,
    borderRadius: LegalTheme.borderRadius.small,
    padding: 12,
    marginBottom: 12,
    backgroundColor: LegalTheme.colors.surface,
    color: LegalTheme.colors.text,
  },
  button: {
    backgroundColor: LegalTheme.colors.primary,
    paddingVertical: 14,
    borderRadius: LegalTheme.borderRadius.medium,
    alignItems: 'center',
    marginTop: 8,
    ...LegalTheme.shadows.small,
  },
  buttonText: {
    color: LegalTheme.colors.surface,
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    color: LegalTheme.colors.primary,
    textAlign: 'center',
    marginTop: 14,
    fontWeight: '500',
  },
  error: {
    color: LegalTheme.colors.accentBurgundy,
    marginBottom: 8,
    textAlign: 'left',
    fontSize: 13,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  backgroundImageInner: {
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: `${LegalTheme.colors.background}CC`,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  heroWrapper: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 16,
  },
  heroColumn: {
    flexDirection: 'column',
    gap: 16,
  },
  rightColumn: {
    flex: 1,
    flexDirection: 'column',
    gap: 16,
  },
  formPanel: {
    flexBasis: 420,
    minWidth: 320,
  },
  brandPanel: {
    flex: 1,
    backgroundColor: LegalTheme.colors.primary,
    borderRadius: LegalTheme.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    ...LegalTheme.shadows.large,
  },
  welcomeCard: {
    backgroundColor: LegalTheme.colors.surface,
    borderRadius: LegalTheme.borderRadius.medium,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...LegalTheme.shadows.large,
  },
  welcomeText: {
    color: LegalTheme.colors.text,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  brandImage: {
    width: 320,
    height: 88,
    resizeMode: 'contain',
    tintColor: undefined,
  },
});

export default styles;