import SvgIcon from "/@/modules/components/Icons/Icon.vue";
export function SidebarSunny() {
  return <SvgIcon icon="ic:round-wb-sunny"></SvgIcon>;
}

export function SidebarNight() {
  return (
    <>
      <SvgIcon icon="ri:moon-clear-fill"></SvgIcon>;
    </>
  );
}
