
import { EnhancedSettingsPanelProps } from '@/types/settings';
import { SettingsDialog } from './settings/SettingsDialog';

export function EnhancedSettingsPanel(props: EnhancedSettingsPanelProps) {
  return <SettingsDialog {...props} />;
}
