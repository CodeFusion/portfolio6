
export type P7WindowShellProps = {
  height: number
  width: number
}

export const P7WindowShell = ({width, height}: P7WindowShellProps) => {

  return (
    <div className="absolute"
         style={{border: '2px dotted black', background: 'transparent', height, width }}
    ></div>
  )
}
