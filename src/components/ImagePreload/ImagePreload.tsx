export function ImagePreload() {
  const icons = [
    "arrow-down.png",
    "arrow-down-active.png",
    "arrow-left.png",
    "arrow-left-active.png",
    "arrow-right.png",
    "arrow-right-active.png",
    "arrow-up.png",
    "arrow-up-active.png",
    "border.png",
    "drive.png",
    "drive-drag.png",
    "file.png",
    "file-drag.png",
    "github.png",
    "github-drag.png",
    "linkedin.png",
    "linkedin-drag.png",
    "resize.png",
    "scrollbar-bg.png",
    "seal-navigator-grey.png",
    "seal-navigator-mono.png",
    "stt.png",
    "stt-drag.png",
    "titlebar-click.png",
    "titlebar-close.png",
    "titlebar-shrink.png"
  ];

  const images = [
    "Pixseal1.png",
    "Pixseal2.png",
    "Pixseal3.png",
    "Pixseal-simple.png",
    "titlebar-bg.png"
  ]

  return (
    <>
      {icons.map((icon, i) => <img key={i} src={"/icons/" + icon} alt={icon} className="hidden"/>)}
      {images.map((image, i) => <img key={i} src={"/" + image} alt={image} className="hidden"/>)}
    </>
  )
}
