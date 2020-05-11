import {$} from '@core/dom'

export function resizeHandler(event, $root) {
  if (!event.target.dataset.resize) {
    return
  }

  const $resizer = $(event.target)
  const $parrent = $resizer.closest('[data-type="resizable"]')
  const coords = $parrent.getCoord()
  const type = $resizer.data.resize

  let value
  const sideProp = type === 'col' ? 'bottom' : 'right'

  $resizer.css({
    opacity: 1,
    [sideProp]: '-5000px',
  })

  document.onmousemove = (e) => {
    if (type === 'col') {
      const delta = e.pageX - coords.right
      value = coords.width + delta
      $resizer.css({
        right: -delta + 'px',
        bottom: '-5000px',
      })
    } else {
      const delta = e.pageY - coords.bottom
      value = coords.height + delta
      $resizer.css({
        bottom: -delta + 'px',
        right: '-5000px',
      })
    }
  }

  document.onmouseup = () => {
    document.onmouseup = null
    document.onmousemove = null

    if (type === 'col') {
      $parrent.css({width: value + 'px'})
      $root.findAll(`[data-col="${$parrent.data.col}"]`)
          .forEach((el) => el.style.width = value + 'px')
    } else {
      $parrent.css({height: value + 'px'})
      $root.findAll(`[data-col="${$parrent.data.row}"]`)
          .forEach((el) => el.style.height = value + 'px')
    }

    $resizer.css({
      opacity: 0,
      bottom: 0,
      right: 0,
    })
  }
}
