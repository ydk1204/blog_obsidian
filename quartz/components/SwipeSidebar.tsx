import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/swipeSidebar.scss"
import { FullSlug, resolveRelative, SimpleSlug } from "../util/path"
import swipeSidebarScript from "./scripts/swipeSidebar.inline"

function SwipeSidebar({ fileData, allFiles, displayClass }: QuartzComponentProps) {
  const currentSlug = fileData.slug!

  return (
    <div class={`swipe-sidebar ${displayClass ?? ""}`}>
      <div class="sidebar-container">
        <div class="left-sidebar">
          <h3>탐색</h3>
          <ul>
            {allFiles.map((file) => (
              <li key={file.slug}>
                <a href={resolveRelative(currentSlug, file.slug! as FullSlug)} class="internal">
                  {file.frontmatter?.title || '제목 없음'}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div class="right-sidebar">
          <h3>목차</h3>
          {/* 목차 내용은 동적으로 생성될 예정입니다 */}
        </div>
      </div>
    </div>
  )
}

SwipeSidebar.css = style
SwipeSidebar.afterDOMLoaded = swipeSidebarScript

export default (() => SwipeSidebar) satisfies QuartzComponentConstructor