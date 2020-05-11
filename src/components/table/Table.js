import {ExcelComponent} from '../../core/ExcelComponent'
import {createTable} from './table-template'
import {resizeHandler} from '@/components/table/table-resize'

export class Table extends ExcelComponent {
  static className = 'excel__table'

  constructor($root) {
    super($root, {
      listeners: ['mousedown'],
    })
  }

  toHTML() {
    return createTable(50)
  }

  onMousedown(event) {
    resizeHandler(event, this.$root)
  }
}
