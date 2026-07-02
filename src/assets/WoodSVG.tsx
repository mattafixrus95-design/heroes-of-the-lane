export default function WoodSVG({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <rect x="17" y="30" width="6" height="7" fill="#6B4020"/>
      <polygon points="20,4 10,18 30,18" fill="#3d7a48"/>
      <polygon points="20,12 8,26 32,26" fill="#4a7c59"/>
      <polygon points="20,20 6,34 34,34" fill="#52965c"/>
    </svg>
  );
}
