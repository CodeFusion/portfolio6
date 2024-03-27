import "./Yuki.css";

export type YukiProps = {
  url: string
}

export const Yuki = ({url}: YukiProps) => {

  return (
    <>
      <div className="bg-white flex flex-row controls">
        <button className="border-black border-2">Back</button>
        <button className="border-black border-2">Forward</button>
        <button className="border-black border-2">Home</button>
        <div className="w-4"></div>
        <button className="border-black border-2">Reload</button>
        <button className="border-black border-2">Print</button>
        <button className="border-black border-2">Stop</button>
        <div className="flex-grow"></div>
        <button className="border-black border-2 justify-self-end flex flex-col justify-center logo"><img src="/icons/seal-navigator-grey.png" alt="Yuki Browser" /></button>
      </div>
      <iframe title={`yuki`} src={url} style={{height: 600, width: 800}} className="grayscale"/>
    </>
  )
}
