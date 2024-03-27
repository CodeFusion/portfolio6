export type P7WindowShellProps = {
  height: number
  width: number
}

export const P7WindowShell = ({width, height}: P7WindowShellProps) => {
  return (
    <div className="z-50 absolute"
         style={{border: '2px dotted black', background: 'transparent', width, height}}
    ></div>
  )
}
