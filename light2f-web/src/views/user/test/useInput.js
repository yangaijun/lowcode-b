import { useState } from 'react';

export function useCheckbox(
  defaultChecked,
) {
  const [checked, setChecked] = useState(defaultChecked);

  return [
    checked,
    {
      type: 'checkbox',
      checked,
      onChange() {
        setChecked(!checked);
      },
    },
  ];
}