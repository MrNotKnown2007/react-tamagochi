import { FontAwesome } from '@expo/vector-icons';
import { type ComponentProps } from 'react';

export function TabBarIcon(props: {
  name: ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}
