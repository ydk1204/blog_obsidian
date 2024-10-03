import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/swipeSidebar.scss"
import { FullSlug, resolveRelative, SimpleSlug } from "../util/path"
import swipeSidebarScript from "./scripts/swipeSidebar.inline"

// 필요한 컴포넌트들을 import 합니다
import Explorer from "./Explorer"
import Graph from "./Graph"
import TableOfContents from "./TableOfContents"
import Backlinks from "./Backlinks"

function SwipeSidebar({ fileData, allFiles, displayClass, ...rest }: QuartzComponentProps) {
  const currentSlug = fileData.slug!

  // 각 컴포넌트를 호출하여 실제 컴포넌트를 생성합니다
  const ExplorerComponent = Explorer()
  const GraphComponent = Graph()
  const TableOfContentsComponent = TableOfContents()
  const BacklinksComponent = Backlinks()

  // 모든 props를 포함하는 객체를 생성합니다
  const fullProps = { ...rest, fileData, allFiles }

  return (
    <div class={`swipe-sidebar ${displayClass ?? ""}`}>
      <div class="sidebar-container">
        <div class="left-sidebar">
          <h3>탐색</h3>
          <ExplorerComponent {...fullProps} />
        </div>
        <div class="right-sidebar">
          <GraphComponent {...fullProps} />
          <TableOfContentsComponent {...fullProps} />
          <BacklinksComponent {...fullProps} />
        </div>
      </div>
    </div>
  )
}

SwipeSidebar.css = style
SwipeSidebar.afterDOMLoaded = swipeSidebarScript

export default (() => SwipeSidebar) satisfies QuartzComponentConstructor