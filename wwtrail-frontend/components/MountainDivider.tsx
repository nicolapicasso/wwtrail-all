// components/MountainDivider.tsx
// Divisor con forma de picos de montaña para transiciones de sección

interface MountainDividerProps {
  /**
   * Color de la parte superior (donde está el hero/header)
   * @default 'currentColor'
   */
  fillColor?: string;
  /**
   * Posición: 'top' para arriba o 'bottom' para abajo
   * @default 'bottom'
   */
  position?: 'top' | 'bottom';
  /**
   * Clase CSS adicional
   */
  className?: string;
}

export function MountainDivider({
  fillColor = 'currentColor',
  position = 'bottom',
  className = ''
}: MountainDividerProps) {
  // Si está en top, volteamos el SVG
  const transform = position === 'top' ? 'scale(1, -1)' : '';

  return (
    <div
      className={`absolute left-0 right-0 ${position === 'bottom' ? 'bottom-0' : 'top-0'} ${className}`}
      style={{
        transform,
        transformOrigin: 'center',
        zIndex: 1
      }}
    >
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-[60px] md:h-[80px] lg:h-[100px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,0
             L0,40
             L50,40
             L80,10
             L110,40
             L160,40
             L200,5
             L240,40
             L290,40
             L330,15
             L370,40
             L420,40
             L465,8
             L510,40
             L560,40
             L610,12
             L660,40
             L710,40
             L755,18
             L800,40
             L850,40
             L895,10
             L940,40
             L990,40
             L1035,15
             L1080,40
             L1130,40
             L1170,8
             L1200,40
             L1200,0
             Z"
          fill={fillColor}
          opacity="1"
        />
        {/* Picos más pronunciados - capa adicional para más profundidad */}
        <path
          d="M0,40
             L0,60
             L60,60
             L95,25
             L130,60
             L180,60
             L225,20
             L270,60
             L320,60
             L370,30
             L420,60
             L470,60
             L520,22
             L570,60
             L620,60
             L675,28
             L730,60
             L780,60
             L830,25
             L880,60
             L930,60
             L980,20
             L1030,60
             L1080,60
             L1130,30
             L1180,60
             L1200,60
             L1200,120
             L0,120
             Z"
          fill={fillColor}
          opacity="1"
        />
      </svg>
    </div>
  );
}
