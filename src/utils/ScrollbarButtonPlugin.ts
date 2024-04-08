import {InstancePlugin} from "overlayscrollbars";

export const scrollbarButtonPluginModuleName = "__scrollbarButtonPlugin"

export const ScrollbarButtonPlugin = /* @__PURE__ */ (() => ({
  [scrollbarButtonPluginModuleName]: {
    instance: (osInstance, event) => {

      const left = document.createElement("button")
      left.classList.add("os-scrollbar-button", "os-scrollbar-button-left")
      const right = document.createElement("button")
      right.classList.add("os-scrollbar-button", "os-scrollbar-button-right")

      const up = document.createElement("button")
      up.classList.add("os-scrollbar-button", "os-scrollbar-button-up")
      const down = document.createElement("button")
      down.classList.add("os-scrollbar-button", "os-scrollbar-button-down")

      osInstance.elements().scrollbarHorizontal.scrollbar.appendChild(left)
      osInstance.elements().scrollbarHorizontal.scrollbar.appendChild(right)
      osInstance.elements().scrollbarVertical.scrollbar.appendChild(up)
      osInstance.elements().scrollbarVertical.scrollbar.appendChild(down)

      const scrollValue = 200

      event('initialized', () => {
        left.addEventListener('mouseup', () => {
          osInstance.elements().viewport.scrollBy(-scrollValue, 0)
        })
        right.addEventListener('mouseup', () => {
          osInstance.elements().viewport.scrollBy(scrollValue, 0)
        })
        up.addEventListener('mouseup', () => {
          osInstance.elements().viewport.scrollBy(0, -scrollValue)
        })
        down.addEventListener('mouseup', () => {
          osInstance.elements().viewport.scrollBy(0, scrollValue)
        })
      })
    }
  }
}))() satisfies InstancePlugin<typeof scrollbarButtonPluginModuleName>
