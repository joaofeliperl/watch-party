import { Icon } from "@iconify-icon/react/dist/iconify.mjs";

type Props = {
  active: boolean;
  from: string;
  to: string;
  size?: number;
};

const ToggleIcon = ({
  active,
  from,
  to,
  size,
  ...props
}: Props & React.HTMLProps<HTMLDivElement>) => {
  return (
    <div {...props}>
      <Icon icon={active ? from : to} size={size} style={{ fontSize: size }} />
    </div>
  );
};

export default ToggleIcon;
