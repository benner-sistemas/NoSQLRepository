var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../../../../../../../out/typescriptapis/DiagShared/inc/TS-1.8.10/JSTreeGridControl.d.ts" />
/// <reference path="../../../../../../../../out/typescriptapis/bptoob/inc/1.8/Plugin.d.ts" />
//
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="ExternalReferences.ts" />
var IntelliTrace;
(function (IntelliTrace) {
    var CustomEvents = (function () {
        function CustomEvents() {
        }
        CustomEvents.NestedGridControlHeightChanged = "nestedgridcontrolheightchangedevent";
        CustomEvents.NestedGridControlHasMouseDown = "nestedgridcontrolhasmousedownevent";
        return CustomEvents;
    }());
    IntelliTrace.CustomEvents = CustomEvents;
    /// <summary>
    /// The base class for grids on detail page.
    /// </summary>
    var CustomGridControl = (function (_super) {
        __extends(CustomGridControl, _super);
        function CustomGridControl(root, options) {
            _super.call(this, root, options);
            this._rowTops = [];
        }
        /// <summary>
        /// Create a cell with a tree icon at the left.
        /// </summary>
        /* protected */ CustomGridControl.prototype.createTreeIconCell = function (expandedState, level, column, value, valueTooltip, iconClass, iconTooltip, iconAlt) {
            // Get Column Width
            var cellElement = this.createElementWithClass("div", this.options().cellClass);
            cellElement.style.width = String(column.width) + "px";
            // Add a tree-sign in front of the text
            if (level > 0) {
                _super.prototype.addTreeIconWithIndent.call(this, cellElement, expandedState, level, column);
            }
            // Add an extra icon before text
            var indent = _super.prototype.getColumnPixelIndent.call(this, level);
            if (iconClass && iconClass !== "") {
                var methodIcon = this.createElementWithClass("div", "icon grid-icon " + iconClass);
                methodIcon.style.left = String(indent) + "px";
                methodIcon.setAttribute("role", "img");
                methodIcon.setAttribute("aria-label", iconAlt);
                cellElement.appendChild(methodIcon);
                // Add additional indent for icon
                indent += CustomGridControl.IconWidth; // add 2px buffer to make sure the width is enough for icon
                if (iconTooltip != null && iconTooltip !== "") {
                    this.setTooltip(methodIcon, iconTooltip);
                }
            }
            var textElement = this.createElementWithClass("div", CustomGridControl.TreeCellSelectionClass);
            textElement.innerText = value;
            if (valueTooltip != null && valueTooltip !== "") {
                this.setTooltip(textElement, valueTooltip);
            }
            cellElement.appendChild(textElement);
            cellElement.style.textIndent = String(indent) + "px";
            // Calculate column's indentOffset
            column.indentOffset = Math.max(column.indentOffset, indent);
            return cellElement;
        };
        CustomGridControl.prototype.getRowTop = function (rowIndex) {
            if (rowIndex < 0 || rowIndex >= this.getExpandedCount()) {
                return 0;
            }
            return this._rowTops[rowIndex];
        };
        CustomGridControl.prototype.getTotalDataHeight = function () {
            var rowCount = this.getExpandedCount();
            var lastRowIndex = rowCount - 1;
            var lastRowHeight = this.getRowHeight(lastRowIndex);
            var lastRowTop = this.getRowTop(lastRowIndex);
            return lastRowTop + lastRowHeight;
        };
        /// <summary>
        /// Get the range of row indices that are in the view.
        /// </summary>
        /// <param name="top"> The vertical offset of the top of the viewport.</param>
        /// <param name="bottom"> The vertical offset of the bottom of the viewport.</param>
        /// <return>Return a key-value data in the form {first: value, last: value }. {first: -1, last: -1} is returned when there no such rows are visible.
        /// When <paramref name="top"/> is larger than <paramref name="bottom"/>, {first: -1, last: -1} is also returned.
        /// </return>
        CustomGridControl.prototype.calculateVisibleRowIndices = function (top, bottom) {
            var firstVisible = -1;
            var lastVisible = -1;
            if (top > bottom) {
                return { first: -1, last: -1 };
            }
            var totalCount = this.getExpandedCount();
            for (var i = 0; i < totalCount; ++i) {
                if (this.getRowTop(i) >= bottom) {
                    break;
                }
                if (this.getRowBottom(i) < top) {
                    continue;
                }
                if (firstVisible === -1) {
                    firstVisible = i;
                }
                lastVisible = i;
            }
            return {
                first: firstVisible,
                last: lastVisible
            };
        };
        /* protected */ CustomGridControl.prototype.getMultilineTextHeight = function (value) {
            var measure = this.getMeasurements();
            // Not sure whether the new line is "\r\n" or "\n". However, we only need to know the number of lines. Matching "\n" should be enough.
            var matches = value.match(/\n/g);
            if (matches) {
                // (multiline text height) = (single line text height -- with row border) + (one line text height) * (number of line break)
                return measure.rowHeight + measure.textLineHeight * matches.length;
            }
            else {
                return measure.rowHeight;
            }
        };
        /* protected */ CustomGridControl.prototype.calcRowTops = function (startRowIndex) {
            // create new array since row count may changed
            var count = _super.prototype.getExpandedCount.call(this);
            for (var i = startRowIndex; i < count; ++i) {
                var newTop = this.getRowBottom(i - 1);
                this._rowTops[i] = newTop;
            }
        };
        /* protected */ CustomGridControl.prototype.getRowHeight = function (rowIndex) {
            throw new Error("getRowHeight() is an abstract class. It must be implemented by sub classes.");
        };
        /* protected */ CustomGridControl.prototype.getRowBottom = function (rowIndex) {
            return this.getRowTop(rowIndex) + this.getRowHeight(rowIndex);
        };
        /* protected */ CustomGridControl.prototype.setActiveOnSelectedRow = function () {
            var selectedDataIndex = this.getSelectedDataIndex();
            var selectedRowInfo = this.getRowInfo(selectedDataIndex);
            if (selectedRowInfo != null) {
                this.checkUpdateActive(selectedRowInfo);
            }
        };
        /// <summary>This is especially necessary for screen readers to read each
        /// row when the selection changes. </summary>
        /* protected */ CustomGridControl.prototype._updateAriaAttribute = function () {
            var dataIndex = this.getSelectedDataIndex();
            if (dataIndex != null) {
                // Getting row info using data index
                var rowInfo = this.getRowInfo(dataIndex);
                if (!rowInfo || !rowInfo.row) {
                    _super.prototype._updateAriaAttribute.call(this);
                }
                else {
                    // Don't check whether the id of selected row is the same as _activeAriaId.
                    // This check is in the base class but is removed here.
                    // With it, if the row doesn't have any children (expanded or not). The screen reader won't read the row.
                    // The reason is uncleared.
                    // Setting active element attribute
                    var ariaLabel = this._getAriaLabelForRow(rowInfo);
                    rowInfo.row.setAttribute("aria-label", ariaLabel);
                    try {
                        this.updateActive(rowInfo.row);
                    }
                    catch (err) {
                    }
                }
            }
        };
        /* protected */ CustomGridControl.prototype._onExpandedCollapsed = function (isExpanded, dataIndex) {
            if (dataIndex != null) {
                var rowIndex = this._getRowIndex(dataIndex);
                this.calcRowTops(rowIndex);
            }
            else {
                this.calcRowTops(0);
            }
            this.fireCustomEvent(this.getElement(), Common.Controls.Grid.GridControl.EVENT_ROW_EXPANDED_COLLAPSED, [{ isExpanded: isExpanded, dataIndex: dataIndex }]);
        };
        // Executes the given event listener if the mouse button for the given
        // event is equal to the given button.
        /* protected */ CustomGridControl.prototype._addMouseUpListener = function (element, button, listener) {
            element.addEventListener("mouseup", function (e) {
                if (e && (e.button == button)) {
                    listener(e);
                }
            });
        };
        /* protected */ CustomGridControl.prototype.setTooltip = function (element, tooltip) {
            if (!element || !tooltip || tooltip === "") {
                return;
            }
            element.setAttribute(CustomGridControl.TooltipAttribute, JSON.stringify({ content: tooltip }));
        };
        // Add tooltip for element when not all the content of the element is visible
        /* protected */ CustomGridControl.prototype.addTooltipWhenObscured = function (element) {
            if (!element) {
                return;
            }
            if (!element.hasAttribute(CustomGridControl.TooltipAttribute) && (element.scrollWidth > element.offsetWidth)) {
                this.setTooltip(element, element.innerText.replace(/\r?\n|\r/g, "<br/>"));
            }
        };
        // find all the elements of specified class and add tooltip when element content is only partly visible
        /* protected */ CustomGridControl.prototype.addTooltipForClasses = function () {
            var _this = this;
            var classes = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                classes[_i - 0] = arguments[_i];
            }
            if (!classes) {
                return;
            }
            classes.forEach(function (className) {
                var nodes = _this.rootElement.getElementsByClassName(className);
                if (!nodes) {
                    return;
                }
                for (var i = 0; i < nodes.length; ++i) {
                    _this.addTooltipWhenObscured(nodes[i]);
                }
            });
        };
        CustomGridControl.IconWidth = 16;
        CustomGridControl.TooltipAttribute = "data-plugin-vs-tooltip";
        CustomGridControl.TreeCellSelectionClass = "tree-cell-for-selection";
        return CustomGridControl;
    }(Common.Controls.Grid.GridControl));
    IntelliTrace.CustomGridControl = CustomGridControl;
})(IntelliTrace || (IntelliTrace = {}));
// 
// Copyright (C) Microsoft. All rights reserved.
//
var IntelliTrace;
(function (IntelliTrace) {
    // Data field names for a stack frame, these strings need to match with the public properties defined in VS side
    var StackFrameDataFields = (function () {
        function StackFrameDataFields() {
        }
        StackFrameDataFields.Signature = "Signature";
        StackFrameDataFields.Description = "Description";
        StackFrameDataFields.TotalTime = "TotalTime";
        StackFrameDataFields.StartTime = "StartTime";
        StackFrameDataFields.EndTime = "EndTime";
        StackFrameDataFields.SelfTime = "SelfTime";
        StackFrameDataFields.Highlight = "Highlight";
        StackFrameDataFields.HasParameters = "HasParameters";
        StackFrameDataFields.HasAction = "HasAction";
        return StackFrameDataFields;
    }());
    IntelliTrace.StackFrameDataFields = StackFrameDataFields;
    // Data field names for a parameter, these strings need to match with the public properties defined in VS side
    var ParameterDataFields = (function () {
        function ParameterDataFields() {
        }
        ParameterDataFields.Name = "Name";
        ParameterDataFields.Value = "Value";
        ParameterDataFields.Type = "Type";
        ParameterDataFields.HasAction = "HasAction";
        ParameterDataFields.ToolTip = "ToolTip";
        return ParameterDataFields;
    }());
    IntelliTrace.ParameterDataFields = ParameterDataFields;
    // Method/Event names exposed from VS side
    var AdapterCalls;
    (function (AdapterCalls) {
        // methods/actions
        AdapterCalls.GetStackFrames = "GetStackFrames";
        AdapterCalls.StartDebugging = "StartDebugging";
        AdapterCalls.GetParameters = "GetParameters";
        AdapterCalls.ExecuteAction = "ExecuteAction";
        // events
        AdapterCalls.ExpandItemInExecutionTreeEvent = "ExpandItemInExecutionTreeEvent";
        AdapterCalls.StartDebugCurrentSelectionEvent = "StartDebugCurrentSelectionEvent";
    })(AdapterCalls = IntelliTrace.AdapterCalls || (IntelliTrace.AdapterCalls = {}));
})(IntelliTrace || (IntelliTrace = {}));
// 
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="ExternalReferences.ts" />
/// <reference path="CustomGridControl.ts" />
/// <reference path="CallDurationTree.ts" />
/// <reference path="ViewModelContracts.ts" />
var IntelliTrace;
(function (IntelliTrace) {
    // Grid control used in method details expansion for parameter data
    var NestedGridControl = (function (_super) {
        __extends(NestedGridControl, _super);
        function NestedGridControl(adaptor, root, dataSource, parentCallDurationTree, totalWidth, outterDataIndex, hasAction) {
            var _this = this;
            var fieldColumn = new Common.Controls.Grid.ColumnInfo(IntelliTrace.ParameterDataFields.Name, Microsoft.Plugin.Resources.getString("ParameterNameColumnHeader"), Microsoft.Plugin.Resources.getString("ParameterNameColumnHeaderTooltip"), 0, false);
            var valueColumn = new Common.Controls.Grid.ColumnInfo(IntelliTrace.ParameterDataFields.Value, Microsoft.Plugin.Resources.getString("ParameterValueColumnHeader"), Microsoft.Plugin.Resources.getString("ParameterValueColumnHeaderTooltip"), 0, false);
            var typeColumn = new Common.Controls.Grid.ColumnInfo(IntelliTrace.ParameterDataFields.Type, Microsoft.Plugin.Resources.getString("ParameterTypeColumnHeader"), Microsoft.Plugin.Resources.getString("ParameterTypeColumnHeaderTooltip"), 0, false);
            fieldColumn.getCellContents = function (rowInfo, dataIndex, expandedState, level, column, indentIndex, columnOrder) {
                return _this.createTreeIconCell(expandedState, level, column, _super.prototype.getColumnText.call(_this, dataIndex, column, 0), null, "method-detail-variable-icon", null, Microsoft.Plugin.Resources.getString("MethodDetailVariableAltText"));
            };
            valueColumn.getCellContents = function (rowInfo, dataIndex, expandedState, level, column, indentIndex, columnOrder) {
                return _this.drawValueCell(rowInfo, dataIndex, expandedState, level, column, indentIndex, columnOrder);
            };
            // The base class constructor will use these two variables, so initialize them before the base constructor.
            var options = new Common.Controls.Grid.GridOptions(null, [fieldColumn, valueColumn, typeColumn], null, null);
            options.canvasClass = "nested-grid-canvas";
            options.rowClass = "grid-row-no-hover";
            options.headerElementClass = "nested-grid-header";
            options.headerColumnElementClass = "nested-grid-header-column";
            // no visual affect for selection in nested grid control
            options.rowSelectedClass = "grid-row-selected-no-hover";
            // use smaller cell padding for nested grid
            options.cellClass = "nested-grid-cell";
            options.focusable = true;
            if (dataSource) {
                options.source = dataSource.RowViewModels;
                options.expandStates = dataSource.ExpandStates;
            }
            options.ariaLabel = Microsoft.Plugin.Resources.getString("ParameterGrid");
            _super.call(this, root, options);
            this.fieldColumn = fieldColumn;
            this.valueColumn = valueColumn;
            this._rowHeights = [];
            this.updateColumnWidths(totalWidth);
            this._adapter = adaptor;
            this._hasAction = hasAction;
            this._parentCallDurationTree = parentCallDurationTree;
            this._outerDataIndex = outterDataIndex;
            this._wrappedTextIndex = this.getWrappedTextIndex();
        }
        Object.defineProperty(NestedGridControl.prototype, "isSelectedFromParent", {
            get: function () {
                return this._isSelectedFromParent;
            },
            set: function (value) {
                this._isSelectedFromParent = value;
                if (this._isSelectedFromParent) {
                    this.setFocusOnSelectedRow();
                }
                // no selection style will apply to this gridControl when it's not selected
                this._updateSelectionStyles();
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Get the index of the first element that need wrapping. Only expect one or none. -1 is returned when no element need wrapping.
        /// </summary>
        NestedGridControl.prototype.getWrappedTextIndex = function () {
            var source = this.options().source;
            for (var i = 0; i < source.length; ++i) {
                if (this.isParameterActionable(i)) {
                    return i;
                }
            }
            return -1;
        };
        /*protected*/ NestedGridControl.prototype._onThemeChanged = function (e) {
            this._rowHeights = [];
            _super.prototype._onThemeChanged.call(this, e);
        };
        /*protected*/ NestedGridControl.prototype._attachEvents = function () {
            var _this = this;
            _super.prototype._attachEvents.call(this);
            this.addEventListenerToCanvas("dblclick", this, this.onDbClick);
            var element = this.getElement();
            element.addEventListener("columnresize", function (e) {
                _this._onColumnResizeEvent(e.customData, true);
            });
        };
        NestedGridControl.prototype._onColumnResizeEvent = function (columns, fireEvent) {
            if (columns.length === 1 && columns[0] !== this.options().columns[1]) {
                // when manually set the column width but that is not the column value.
                return;
            }
            if (this._wrappedTextIndex !== -1 || this._rowHeights.length === 0) {
                if (this._rowHeights.length === 0) {
                    this.calcRowTops(0);
                }
                else {
                    var width = this.getLinkElementWidth(this.options().columns[1].width);
                    this.calculateRowHeight(this._wrappedTextIndex, width);
                    var rowIndex = this._getRowIndex(this._wrappedTextIndex);
                    this.calcRowTops(rowIndex);
                }
                if (fireEvent) {
                    this.fireCustomEvent(this.getCanvas(), IntelliTrace.CustomEvents.NestedGridControlHeightChanged, [this._outerDataIndex]);
                }
            }
        };
        NestedGridControl.prototype.onDbClick = function (e) {
            if (this.isSelectedActionable()) {
                this.executeAction();
            }
        };
        /*protected*/ NestedGridControl.prototype._onRowMouseDown = function (e) {
            e.stopPropagation(); // stop scrolling to the nested grid top.
            _super.prototype._onRowMouseDown.call(this, e);
            this.fireCustomEvent(this.getCanvas(), IntelliTrace.CustomEvents.NestedGridControlHasMouseDown, [this._outerDataIndex]);
        };
        NestedGridControl.prototype.updateColumnWidths = function (totalWidth) {
            var options = _super.prototype.options.call(this);
            if (totalWidth <= 0) {
                return;
            }
            options.columns[0].width = totalWidth * NestedGridControl.ParameterNameColumnWidthRatio;
            options.columns[1].width = totalWidth * NestedGridControl.ParameterValueColumnWidthRatio;
            options.columns[2].width = totalWidth * NestedGridControl.ParameterTypeColumnWidthRatio;
            this._onColumnResizeEvent(options.columns, false);
        };
        NestedGridControl.prototype.setFocusOnSelectedRow = function () {
            var selectedDataIndex = this.getSelectedDataIndex();
            var selectedRowInfo = this.getRowInfo(selectedDataIndex);
            if (selectedRowInfo != null) {
                selectedRowInfo.row.focus();
            }
        };
        /// <summary>
        /// Set the selected row active if the current grid control is selected from the parent control.
        /// </summary>
        NestedGridControl.prototype.setActiveRow = function () {
            if (this.isSelectedFromParent) {
                this.setActiveOnSelectedRow();
            }
        };
        /*protected*/ NestedGridControl.prototype._onContainerResize = function (e) {
            // do nothing, nested gridControl don't need to response to window resize event and re-layout itself
        };
        // Return true if the keyboard event is not processed
        /*protected*/ NestedGridControl.prototype._onKeyDown = function (e) {
            return false;
        };
        NestedGridControl.prototype.handleKeyDownEventInOuterGrid = function (e) {
            var bounds = { lo: -1, hi: -1 };
            var expandedCount = _super.prototype.getExpandedCount.call(this);
            if (expandedCount > 0) {
                bounds = { lo: 0, hi: expandedCount - 1 };
            }
            var selectedRowIndex = this.getSelectedRowIndex();
            if (selectedRowIndex < 0) {
                _super.prototype._addSelection.call(this, bounds.lo);
            }
            var selectedRowExpandState = 0;
            if (selectedRowIndex >= 0) {
                selectedRowExpandState = this._getExpandState(this._getDataIndex(selectedRowIndex));
            }
            // When selection is the last and trying to move down,
            // or when selection is the first and trying to move up, 
            // let the parent grid control handle this event
            if (((e.keyCode == Common.KeyCodes.ARROW_DOWN) && (selectedRowIndex == bounds.hi)) ||
                ((e.keyCode == Common.KeyCodes.ARROW_UP) && (selectedRowIndex == bounds.lo)) ||
                ((e.keyCode == Common.KeyCodes.ARROW_RIGHT) && (selectedRowExpandState >= 0) && (selectedRowIndex == bounds.hi)) ||
                ((e.keyCode == Common.KeyCodes.ARROW_LEFT) && (selectedRowExpandState <= 0) && (selectedRowIndex == bounds.lo))) {
                return true;
            }
            if (e.keyCode == Common.KeyCodes.ENTER) {
                if (this.isSelectedActionable()) {
                    this.executeAction();
                }
                return false;
            }
            return _super.prototype._onKeyDown.call(this, e);
        };
        /*protected*/ NestedGridControl.prototype._updateRowSelectionStyle = function (rowInfo, selectedRows, focusIndex) {
            var rowIndex = rowInfo.rowIndex;
            var rowElement = rowInfo.row;
            var options = _super.prototype.options.call(this);
            rowElement.classList.remove(options.rowSelectedClass);
            rowElement.classList.remove(options.rowSelectedBlurClass);
            rowElement.classList.remove(options.rowCurrentClass);
            rowElement.setAttribute("aria-selected", "false");
            if (rowIndex === focusIndex) {
                rowElement.classList.add(options.rowCurrentClass);
            }
            var isSelected = (this.isSelectedFromParent && selectedRows && selectedRows.hasOwnProperty(rowIndex));
            var isActive = this.isActive();
            if (isSelected) {
                rowElement.setAttribute("aria-selected", "true");
                if (isActive) {
                    rowElement.classList.add(options.rowSelectedClass);
                }
                else {
                    rowElement.classList.add(options.rowSelectedBlurClass);
                }
            }
            var linkNodes = rowElement.getElementsByClassName(NestedGridControl.paramLinkSelectionClass);
            if (linkNodes.length > 0) {
                var linkElement = linkNodes[0];
                this.removeHyperlinkStyle(linkElement);
                if (isSelected) {
                    if (isActive) {
                        this.addHyperlinkToActiveSelectedStyle(linkElement);
                    }
                    else {
                        this.addHyperlinkToInactiveSelectedStyle(linkElement);
                    }
                }
                else {
                    this.addHyperlinkToUnselectedStyle(linkElement);
                }
            }
        };
        // Nested grid control never has it's own scroll and the default getSelectedRowIntoView() won't have effect on nested grid;
        // this function will bring the selected row in nested grid into the visible area of parent control.
        NestedGridControl.prototype.getSelectedRowIntoView = function (force) {
            return this.getRowIntoParentView(this.getSelectedRowIndex());
        };
        /*protected*/ NestedGridControl.prototype._drawRows = function (visibleRange, includeNonDirtyRows) {
            _super.prototype._drawRows.call(this, visibleRange, includeNonDirtyRows);
            this.addTooltipForClasses(IntelliTrace.CustomGridControl.TreeCellSelectionClass, NestedGridControl.ValueCellSelectionClass);
        };
        // Bring certain row of nested grid into the visible area of parent control.
        NestedGridControl.prototype.getRowIntoParentView = function (rowIndex) {
            if (rowIndex === -1) {
                return;
            }
            // Get top/bottom of nested grid's canvas relative to outer canvas.
            // To do this we get the nested grid top relative to outer canvas, then add the nested grid header height
            var nestedCanvasTop = this.getOffsetTopToParentCanvas() + this.getHeaderHeight();
            // Get the visible scroll area of outer grid canvas
            var outerCanvas = this._parentCallDurationTree.getCanvas();
            var outerCanvasTop = outerCanvas.scrollTop;
            var outerCanvasHeight = outerCanvas.clientHeight;
            var outerCanvasBottom = outerCanvas.scrollTop + outerCanvasHeight;
            var rowTopOfSelectedRow = this.getRowTop(rowIndex);
            var expectedScrollTop = rowTopOfSelectedRow + nestedCanvasTop;
            var rowHeightOfSelectedRow = this.getRowHeight(rowIndex);
            if (expectedScrollTop < outerCanvasTop) {
                outerCanvas.scrollTop = expectedScrollTop;
            }
            else if (expectedScrollTop + rowHeightOfSelectedRow >= outerCanvasBottom) {
                var offset = rowHeightOfSelectedRow - outerCanvasHeight;
                if (offset > 0) {
                    offset = 0;
                }
                outerCanvas.scrollTop = expectedScrollTop + offset;
            }
            return false;
        };
        NestedGridControl.prototype.getOffsetTopToParentCanvas = function () {
            var element = this.rootElement;
            var parentCanvas = this._parentCallDurationTree.getCanvas();
            var offsetTop = 0;
            do {
                offsetTop += element.offsetTop;
                element = element.offsetParent;
            } while (element && element !== parentCanvas);
            return offsetTop;
        };
        NestedGridControl.prototype.drawValueCell = function (rowInfo, dataIndex, expandedState, level, column, indentIndex, columnOrder) {
            var width = column.width || 20, href;
            var options = this.options();
            var cellElement = this.createElementWithClass("div", options.cellClass + " " + NestedGridControl.ValueCellSelectionClass);
            cellElement.style.width = isNaN(width) ? String(width) : width + "px";
            var value = this.getColumnText(dataIndex, column, columnOrder);
            var rowHeight = this.getRowHeight(rowInfo.rowIndex);
            if (value) {
                var customDrawn = false;
                if (this._hasAction) {
                    var parameterName = _super.prototype.getColumnText.call(this, dataIndex, this.fieldColumn, 0);
                    if (this.isParameterActionable(dataIndex)) {
                        var isSelected = (dataIndex === this.getSelectedDataIndex());
                        var valueTooltip = this.getColumnValue(dataIndex, IntelliTrace.ParameterDataFields.ToolTip, 0);
                        var linkContainerElement = this.createLinkElement(parameterName, value, isSelected, valueTooltip);
                        linkContainerElement.style.height = String(rowHeight - 4) + "px"; // 4 is the height of the padding in the cell element.
                        cellElement.appendChild(linkContainerElement);
                        customDrawn = true;
                    }
                }
                if (!customDrawn) {
                    cellElement.innerText = value;
                }
            }
            else {
                // add non-breaking whitespace to ensure the cell has the same height as non-empty cells
                cellElement.innerHTML = "&nbsp;";
            }
            if (columnOrder === indentIndex && level > 0) {
                this.addTreeIconWithIndent(cellElement, expandedState, level, column);
            }
            if (column.getCellCSSClass) {
                var dataSource = options.source;
                var cellStyle = column.getCellCSSClass(dataIndex, column.index, columnOrder, dataSource);
                if (cellStyle) {
                    var styles = cellStyle.trim().split(" ");
                    for (var index = 0; index < styles.length; index++) {
                        cellElement.classList.add(styles[index]);
                    }
                }
            }
            if (column.rowCss) {
                cellElement.classList.add(column.rowCss);
            }
            rowInfo.row.style.height = String(this.getRowHeight(rowInfo.rowIndex)) + "px";
            return cellElement;
        };
        /* protected */ NestedGridControl.prototype.getRowHeight = function (rowIndex) {
            if ((this.options().source == null) || (rowIndex < 0) || (this.getExpandedCount() <= rowIndex)) {
                return 0;
            }
            var dataIndex = this._getDataIndex(rowIndex);
            if (this._rowHeights.length === 0) {
                var width = this.getLinkElementWidth(this.options().columns[1].width);
                var source = this.options().source;
                for (var i = dataIndex; i < source.length; ++i) {
                    this.calculateRowHeight(i, width);
                }
            }
            return this._rowHeights[dataIndex];
        };
        NestedGridControl.prototype._getAriaLabelForRow = function (rowInfo) {
            var ariaLabel = "";
            var dataIndex = rowInfo.dataIndex;
            var columns = _super.prototype.options.call(this).columns;
            for (var i = 0, l = columns.length; i < l; i++) {
                var column = columns[i];
                if (column.hidden) {
                    continue;
                }
                var columnText = this.getColumnText(dataIndex, column, i);
                var cellText = column.text +
                    ", " +
                    ((column === this.valueColumn && this.isParameterActionable(dataIndex)) ?
                        Microsoft.Plugin.Resources.getString("ParameterHyperlinkScreenreaderIndicator", columnText) :
                        columnText);
                if (ariaLabel) {
                    ariaLabel += ", ";
                }
                ariaLabel += cellText;
            }
            return ariaLabel;
        };
        NestedGridControl.prototype.calculateRowHeight = function (dataIndex, width) {
            var value = this.getColumnValue(dataIndex, IntelliTrace.ParameterDataFields.Value, 0);
            if (this.isParameterActionable(dataIndex)) {
                // 4 is the heights of paddings in the cell element..
                this._rowHeights[dataIndex] = this.measureParamValueSize(value, width).height + 4;
            }
            else {
                this._rowHeights[dataIndex] = this.getMultilineTextHeight(value);
            }
        };
        /// <summary>
        /// Get the width of the element which holds the link in column value. <paramref name="width"/> is the width of the cell element of the column value.
        /// </summary>
        NestedGridControl.prototype.getLinkElementWidth = function (width) {
            return width - 8; // 8 pixel for the padding in the cell element
        };
        NestedGridControl.prototype.createLinkElement = function (parameterName, value, isSelected, valueTooltip) {
            var _this = this;
            if (isSelected != null && isSelected) {
                linkContainerClass = NestedGridControl.paramHyperlinkSelected + " ";
                if (this.isSelectedFromParent) {
                    linkContainerClass += NestedGridControl.DottedBorderClass + " ";
                }
                else {
                    linkContainerClass += NestedGridControl.BorderPlaceHolderClass + " ";
                }
            }
            else {
                var linkContainerClass = NestedGridControl.paramHyperlinkNotSelected + " ";
            }
            linkContainerClass += NestedGridControl.paramLinkSelectionClass + " text-wrapping";
            var linkContainerElement = this.createElementWithClass("div", linkContainerClass);
            var linkElement = this.createElementWithClass("a");
            linkElement.innerText = value;
            this._addMouseUpListener(linkElement, 0, function (e) { _this.executeAction(parameterName); });
            if (valueTooltip != null && valueTooltip !== "") {
                linkElement.setAttribute("data-plugin-vs-tooltip", JSON.stringify({ content: valueTooltip }));
            }
            linkContainerElement.appendChild(linkElement);
            return linkContainerElement;
        };
        /// <summary>
        /// Measure and return the height of a div element which will be holding the <paramref name="value"/>. The width of the div element is set
        /// by <param name="width"/>.
        /// Note the result is the offsetHeight of the div element. It includes the height of the border.
        /// </summary>
        NestedGridControl.prototype.measureParamValueSize = function (value, width) {
            if (width === void 0) { width = 0; }
            var measurementContainer = this.createElementWithClass("div");
            measurementContainer.style.position = "absolute";
            measurementContainer.style.left = "-5000px";
            measurementContainer.style.top = "-5000px";
            measurementContainer.style.width = "1000px";
            measurementContainer.style.height = "500px";
            document.body.appendChild(measurementContainer);
            var linkContainerElement = this.createLinkElement(null, value);
            if (width > 0) {
                // element width is specified, measure the height of multi-line text
                linkContainerElement.style.width = String(width) + "px";
            }
            else {
                // element width isn't specified, make element float to left therefore we can get the necessary width for the text
                linkContainerElement.classList.add("floatleft");
            }
            measurementContainer.appendChild(linkContainerElement);
            var width = linkContainerElement.offsetWidth;
            var height = linkContainerElement.offsetHeight;
            // Remove the hidden element
            document.body.removeChild(measurementContainer);
            return new Common.Controls.Grid.Size(width, height);
        };
        NestedGridControl.prototype.getSelectedParameterName = function () {
            var dataIndex = this.getSelectedDataIndex();
            var parameterName = this.getColumnText(dataIndex, this.fieldColumn, 0);
            return parameterName;
        };
        NestedGridControl.prototype.getSelectedParameterValue = function () {
            var dataIndex = this.getSelectedDataIndex();
            var parameterValue = this.getColumnText(dataIndex, this.valueColumn, 0);
            return parameterValue;
        };
        NestedGridControl.prototype.isSelectedActionable = function () {
            var dataIndex = this.getSelectedDataIndex();
            return this.isParameterActionable(dataIndex);
        };
        NestedGridControl.prototype.isParameterActionable = function (index) {
            return this.getColumnValue(index, IntelliTrace.ParameterDataFields.HasAction, 0);
        };
        NestedGridControl.prototype.removeHyperlinkStyle = function (element) {
            if (element != null) {
                element.classList.remove(NestedGridControl.BorderPlaceHolderClass);
                element.classList.remove(NestedGridControl.DottedBorderClass);
                element.classList.remove(NestedGridControl.paramHyperlinkNotSelected);
                element.classList.remove(NestedGridControl.paramHyperlinkSelected);
            }
        };
        NestedGridControl.prototype.addHyperlinkToActiveSelectedStyle = function (element) {
            if (element != null) {
                element.classList.add(NestedGridControl.DottedBorderClass);
                element.classList.add(NestedGridControl.paramHyperlinkSelected);
            }
        };
        NestedGridControl.prototype.addHyperlinkToInactiveSelectedStyle = function (element) {
            if (element != null) {
                element.classList.add(NestedGridControl.BorderPlaceHolderClass);
                element.classList.add(NestedGridControl.paramHyperlinkSelected);
            }
        };
        NestedGridControl.prototype.addHyperlinkToUnselectedStyle = function (element) {
            if (element != null) {
                element.classList.add(NestedGridControl.BorderPlaceHolderClass);
                element.classList.add(NestedGridControl.paramHyperlinkNotSelected);
            }
        };
        NestedGridControl.prototype.executeAction = function (parameterName) {
            if (parameterName === void 0) { parameterName = null; }
            if (!parameterName) {
                parameterName = this.getSelectedParameterName();
            }
            // get the binding rectangle for action link element
            var elementRect = this.getSelectedLinkElementRect();
            // get the actual width of the link text, since the link element width will always be column width
            var parameterValue = this.getSelectedParameterValue();
            var textWidth = this.measureParamValueSize(parameterValue).width;
            textWidth = Math.min(textWidth, elementRect.width);
            if (elementRect && textWidth) {
                this._adapter._call(IntelliTrace.AdapterCalls.ExecuteAction, this._outerDataIndex, parameterName, elementRect.left, elementRect.top, textWidth, elementRect.height);
            }
            else {
                this._adapter._call(IntelliTrace.AdapterCalls.ExecuteAction, this._outerDataIndex, parameterName, 0, 0, 0, 0);
            }
        };
        // Get the bounding rect for selected row's action link
        NestedGridControl.prototype.getSelectedLinkElementRect = function () {
            var dataIndex = this.getSelectedDataIndex();
            var rowInfo = this.getRowInfo(dataIndex);
            var element = rowInfo.row.querySelector("." + NestedGridControl.paramLinkSelectionClass);
            if (element) {
                return element.getBoundingClientRect();
            }
            else {
                return null;
            }
        };
        NestedGridControl.ParameterNameColumnWidthRatio = 0.2;
        NestedGridControl.ParameterValueColumnWidthRatio = 0.45;
        NestedGridControl.ParameterTypeColumnWidthRatio = 0.35;
        NestedGridControl.paramLinkSelectionClass = "param-link-for-selection";
        NestedGridControl.BorderPlaceHolderClass = "border-placeholder";
        NestedGridControl.DottedBorderClass = "dotted-border";
        NestedGridControl.paramHyperlinkNotSelected = "hyperlink";
        NestedGridControl.paramHyperlinkSelected = "calltree-hyperlink-selected";
        NestedGridControl.ValueCellSelectionClass = "value-cell-for-selection";
        return NestedGridControl;
    }(IntelliTrace.CustomGridControl));
    IntelliTrace.NestedGridControl = NestedGridControl;
})(IntelliTrace || (IntelliTrace = {}));
// 
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="ExternalReferences.ts" />
/// <reference path="CustomGridControl.ts" />
/// <reference path="NestedGridControl.ts" />
/// <reference path="ViewModelContracts.ts" />
var IntelliTrace;
(function (IntelliTrace) {
    (function (EventHandlingResult) {
        EventHandlingResult[EventHandlingResult["COMPLETE"] = 0] = "COMPLETE";
        EventHandlingResult[EventHandlingResult["PARTIAL"] = 1] = "PARTIAL";
        EventHandlingResult[EventHandlingResult["NONE"] = 2] = "NONE";
    })(IntelliTrace.EventHandlingResult || (IntelliTrace.EventHandlingResult = {}));
    var EventHandlingResult = IntelliTrace.EventHandlingResult;
    var MethodDetail = (function () {
        function MethodDetail() {
            this.isExpanded = false;
            this.parameterData = null;
            this.isDataReady = false;
            this.detailElement = null;
            this.detailElementHeight = 0;
            this.callDurationElement = null;
            this.descriptionElement = null;
            this.signatureElement = null;
            this.signatureHeight = 0;
            this.gridControl = null;
            this.isDirty = false;
        }
        return MethodDetail;
    }());
    IntelliTrace.MethodDetail = MethodDetail;
    var CallDurationTree = (function (_super) {
        __extends(CallDurationTree, _super);
        function CallDurationTree(adapter, root) {
            // construction sequence:
            // base class sets up the states and two timers: one for attaching
            // events, the other for layout.
            // These two timers are fired (possibly) before we got data.
            // Then init() is called to setup the grid columns and request
            // data. After the data is returned, we set the data source to the
            // grid and then relayout.
            var options = new Common.Controls.Grid.GridOptions(null, null, null, null);
            options.rowClass = "grid-row-no-hover";
            options.rowSelectedClass = "grid-row-selected-no-hover";
            options.rowSelectedBlurClass = options.rowSelectedClass;
            options.coreCssClass += " not-passthrough-pointer-events";
            options.ariaLabel = Microsoft.Plugin.Resources.getString("CallDurationTree");
            _super.call(this, root, options);
            this._adapter = adapter;
            this._frameNameHeight = [];
            this._methodDetails = {};
            this._stopAutoResizing = false;
            this._dataIndexOfHoveredRow = CallDurationTree.InvalidDataIndexForSelection;
            this._pendingLayout = false;
            this._pendingLayoutTimeoutId = 0;
            this._debugEventLinkWidth = -1;
            this._debugEventLinkWidthAdjustment = 15;
            this._selectedSlowestNodeDataIndex = CallDurationTree.InvalidDataIndexForSelection;
            this._lastSelectedDataIndex = CallDurationTree.InvalidDataIndexForSelection;
        }
        Object.defineProperty(CallDurationTree.prototype, "selectedNestedGrid", {
            get: function () {
                return this._selectedNestedGrid;
            },
            set: function (value) {
                if (this.selectedNestedGrid === value) {
                    return;
                }
                if (this._selectedNestedGrid) {
                    this._selectedNestedGrid.isSelectedFromParent = false;
                }
                this._selectedNestedGrid = value;
                if (this._selectedNestedGrid) {
                    this._selectedNestedGrid.isSelectedFromParent = true;
                    // If no row is selected in nested grid, select the first row, otherwise keep the current selection
                    if (this._selectedNestedGrid.getSelectedRowIndex() < 0) {
                        this.selectedNestedGrid._addSelection(0);
                    }
                }
                // no selection style will be applied when nested grid is selected
                // update selection style to make sure all selection styles are removed
                this._updateSelectionStyles();
            },
            enumerable: true,
            configurable: true
        });
        CallDurationTree.prototype.init = function (done) {
            var _this = this;
            // Initialize grid control columns
            // Custom draw the first column to add icon and text color
            this._callDurationColumn = new Common.Controls.Grid.ColumnInfo(IntelliTrace.StackFrameDataFields.TotalTime, Microsoft.Plugin.Resources.getString("TotalTimeColumnHeader"), Microsoft.Plugin.Resources.getString("TotalTimeColumnHeaderTooltip"), CallDurationTree.DefaultTotalTimeColumnWidth, false);
            this._callDurationColumn.getCellContents = this.drawCallDurationCell.bind(this);
            // Custom draw the second column to enable method detail expand
            this._frameNameColumn = new Common.Controls.Grid.ColumnInfo(IntelliTrace.StackFrameDataFields.Signature, Microsoft.Plugin.Resources.getString("MethodNameColumnHeader"), Microsoft.Plugin.Resources.getString("MethodNameColumnHeaderTooltip"), CallDurationTree.DefaultMethodNameColumnWidth, false);
            this._frameNameColumn.getCellContents = this.drawStackFrameCell.bind(this);
            var columns = [this._callDurationColumn, this._frameNameColumn];
            this._adapter.addEventListener(IntelliTrace.AdapterCalls.ExpandItemInExecutionTreeEvent, function (eventArgs) {
                var expandItemEventArgs = eventArgs;
                if (expandItemEventArgs != null) {
                    var dataIndex = expandItemEventArgs.DataIndex;
                    _this.expandItemByDataIndex(dataIndex);
                }
            });
            this._adapter._call(IntelliTrace.AdapterCalls.GetStackFrames).done(function (result) {
                var itemsSource = (result);
                var selectedDataIndex = itemsSource.SelectedDataIndex;
                // use data index to initialize members
                for (var i = 0; i < itemsSource.RowViewModels.length; ++i) {
                    var rowViewModel = itemsSource.RowViewModels[i];
                    var description = rowViewModel[IntelliTrace.StackFrameDataFields.Description];
                    // create method detail when has parameter or description string 
                    if (rowViewModel[IntelliTrace.StackFrameDataFields.HasParameters] || (description && (description !== ""))) {
                        _this._methodDetails[i] = new MethodDetail();
                        if (!rowViewModel[IntelliTrace.StackFrameDataFields.HasParameters]) {
                            // If the method doesn't have parameters at all, we have all the needed data when description is available.
                            _this._methodDetails[i].isDataReady = true;
                        }
                    }
                }
                // Don't set the selected row index. There is no row yet and it's hard to predict the row index from data index now.
                _this.setDataSource(itemsSource.RowViewModels, itemsSource.ExpandStates, columns, null);
                // Initialize row tops
                _this.calcRowTops(0);
                _this.expandItemByDataIndex(selectedDataIndex);
                done();
            });
            this._adapter.addEventListener(IntelliTrace.AdapterCalls.StartDebugCurrentSelectionEvent, function () {
                var selectedDataIndex = _super.prototype.getSelectedDataIndex.call(_this);
                if (selectedDataIndex >= 0) {
                    _this._adapter._call(IntelliTrace.AdapterCalls.StartDebugging, selectedDataIndex);
                }
            });
        };
        /*protected*/ CallDurationTree.prototype._onContainerResize = function (e) {
            /*
             * HTML page usually won't receive a size change event on window initialize.
             * This happens to work in our scenario only because VS tool window resize itself on initialize.
             */
            if (!this._stopAutoResizing) {
                var headerWidth = this.getVisibleWidth();
                this._callDurationColumn.width = headerWidth * 0.1;
                if (this._callDurationColumn.width > CallDurationTree.MaxTotalTimeColumnWidth) {
                    this._callDurationColumn.width = CallDurationTree.MaxTotalTimeColumnWidth;
                }
                else if (this._callDurationColumn.width < CallDurationTree.MinTotalTimeColumnWidth) {
                    this._callDurationColumn.width = CallDurationTree.MinTotalTimeColumnWidth;
                }
                this.adjustWidth(headerWidth, this._callDurationColumn.width);
            }
            _super.prototype._onContainerResize.call(this, e);
        };
        /// <summary>Custom drawing of the call duration cell with method icon and highlighted text
        /// </summary>
        /// <param name="rowInfo" type="Object">The information about grid row that is being rendered.</param>
        /// <param name="dataIndex" type="Number">The index of the row.</param>
        /// <param name="expandedState" type="Number">Number of children in the tree under this row recursively.</param>
        /// <param name="level" type="Number">The hierarchy level of the row.</param>
        /// <param name="column" type="Object">Information about the column that is being rendered.</param>
        /// <param name="indentIndex" type="Number">Index of the column that is used for the indentation.</param>
        /// <param name="columnOrder" type="Number">The display order of the column.</param>
        /// <returns>Returns html element representing the requested grid cell. The first returned element will be appended
        /// to the row (unless the function returns <c>null</c> or <c>undefined</c>).</returns>
        CallDurationTree.prototype.drawCallDurationCell = function (rowInfo, dataIndex, expandedState, level, column, indentIndex, columnOrder) {
            // Get Column text
            var value = _super.prototype.getColumnText.call(this, dataIndex, column, 0);
            if (!value || value === "") {
                value = "0"; // show "0 ms" when the call duration isn't available
            }
            value = Microsoft.Plugin.Resources.getString("CallDurationCellText", value);
            var flameIconClass = "icon-placeholder";
            var flameIconTooltip = "";
            var flameIconAltText = "";
            if (dataIndex === this._selectedSlowestNodeDataIndex) {
                // Special case for the slowest node. This slowest node is still in the hot path.
                flameIconClass = "large-flame-icon";
                flameIconTooltip = Microsoft.Plugin.Resources.getString("SlowestNodeTooltip");
                flameIconAltText = Microsoft.Plugin.Resources.getString("SlowestNodeAltText");
            }
            else if (this.isInHotPath(dataIndex, Math.abs(expandedState))) {
                flameIconClass = "small-flame-icon";
                flameIconTooltip = Microsoft.Plugin.Resources.getString("HotpathTooltip");
                flameIconAltText = Microsoft.Plugin.Resources.getString("HotpathNodeAltText");
            }
            // Get tooltip
            var startTime = _super.prototype.getColumnValue.call(this, dataIndex, IntelliTrace.StackFrameDataFields.StartTime, columnOrder);
            var endTime = _super.prototype.getColumnValue.call(this, dataIndex, IntelliTrace.StackFrameDataFields.EndTime, columnOrder);
            var totalTime = _super.prototype.getColumnValue.call(this, dataIndex, IntelliTrace.StackFrameDataFields.TotalTime, columnOrder);
            var selfTime = _super.prototype.getColumnValue.call(this, dataIndex, IntelliTrace.StackFrameDataFields.SelfTime, columnOrder);
            var valueTooltip = Microsoft.Plugin.Resources.getString("TotalTimeColumnTooltip", startTime, endTime, totalTime, selfTime);
            var cellElement = this.createTreeIconCell(expandedState, level, column, value, valueTooltip, flameIconClass, flameIconTooltip, flameIconAltText);
            cellElement.classList.add(CallDurationTree.DurationCellSelectionClass);
            cellElement.style.height = String(this.getFrameNameHeight(dataIndex) - CallDurationTree.RowBorderHeight) + "px";
            if (cellElement.innerText !== "") {
                var highlight = _super.prototype.getColumnValue.call(this, dataIndex, IntelliTrace.StackFrameDataFields.Highlight, columnOrder);
                if (highlight) {
                    // The text highlight needs to be turned off when the row is selected. HighlightCellClass is
                    // added so later we can use getElementsByClassName() to find the cell element from the row.                    
                    cellElement.classList.add(CallDurationTree.HighlightCellClass);
                    cellElement.classList.add(CallDurationTree.HighlightTextClass);
                }
                var selectedDataIndex = this.getSelectedDataIndex();
                if (dataIndex === this._dataIndexOfHoveredRow && dataIndex !== selectedDataIndex) {
                    // show the hover effect.
                    if (highlight) {
                        //If a row is highlighted, we should still color it red
                        cellElement.classList.add(CallDurationTree.HighlightHoverClass);
                    }
                    else {
                        cellElement.classList.add(CallDurationTree.RowHoverClass);
                    }
                }
            }
            if (this._methodDetails.hasOwnProperty(dataIndex)) {
                this._methodDetails[dataIndex].callDurationElement = cellElement;
            }
            return cellElement;
        };
        /*protected*/ CallDurationTree.prototype._drawRows = function (visibleRange, includeNonDirtyRows) {
            var dirtyMethodDetails = [];
            // super._drawRows() will set row element's innerHTML = "" which will destroy all its descendents.
            // We need to temporarily move methodDetail element to a new parent and avoid getting destroyed.
            for (var i = 0; i < visibleRange.length; ++i) {
                var dataIndex = visibleRange[i].dataIndex;
                if (this._methodDetails.hasOwnProperty(dataIndex) && this._methodDetails[dataIndex].detailElement) {
                    var methodDetail = this._methodDetails[dataIndex];
                    if (methodDetail.isDirty && methodDetail.gridControl) {
                        dirtyMethodDetails.push(methodDetail);
                    }
                    var rowIndex = visibleRange[i].rowIndex;
                    var row = _super.prototype.getRowInfo.call(this, dataIndex);
                    if (row && (row.rowIndex !== rowIndex || row.isDirty || includeNonDirtyRows) && methodDetail.detailElement.parentElement) {
                        // It's expensive to draw a nested gridControl so we want to reuse the HTMLElement once created.
                        // However gridControl will destroy old row's all descendent elements on redraw and this will destroy 
                        // the nested gridControl as well. remove detailElement from row's descendent tree and avoid 
                        // getting destroyed
                        methodDetail.detailElement.parentElement.removeChild(methodDetail.detailElement);
                    }
                }
            }
            _super.prototype._drawRows.call(this, visibleRange, includeNonDirtyRows);
            this.addTooltipForClasses(CallDurationTree.DescriptionTextElementSelectionClass, CallDurationTree.SignatureElementSelectionClass);
            // Now parent gridControl already finished drawing the row elements. We need to re-draw the dirty nested grids
            // this can't be done earlier since the parent row element isn't ready yet and nested gridControl will have 0 
            // canvas height
            // TODO: We may need to review this. In drawing rows
            // (super._drawRows) in the outer grid control, some
            // states may be changed in the nested grid control
            // (e.g. checkUpdateActive may try to set the selected
            // row in the nested grid control active).
            for (var j = 0; j < dirtyMethodDetails.length; ++j) {
                dirtyMethodDetails[j].isDirty = false;
                dirtyMethodDetails[j].gridControl.layout();
            }
        };
        /// <summary>Custom drawing of the stack frame cell, it will fallback to default drawing if the stack frame is not expandable.
        /// Otherwise it will draw a cell with nested grid control
        /// </summary>
        /// <param name="rowInfo" type="Object">The information about grid row that is being rendered.</param>
        /// <param name="dataIndex" type="Number">The index of the row.</param>
        /// <param name="expandedState" type="Number">Number of children in the tree under this row recursively.</param>
        /// <param name="level" type="Number">The hierarchy level of the row.</param>
        /// <param name="column" type="Object">Information about the column that is being rendered.</param>
        /// <param name="indentIndex" type="Number">Index of the column that is used for the indentation.</param>
        /// <param name="columnOrder" type="Number">The display order of the column.</param>
        /// <returns>Returns html element representing the requested grid cell. The first returned element will be appended
        /// to the row (unless the function returns <c>null</c> or <c>undefined</c>).</returns>
        CallDurationTree.prototype.drawStackFrameCell = function (rowInfo, dataIndex, expandedState, level, column, indentIndex, columnOrder) {
            // Get Column text and expand state
            var signature = _super.prototype.getColumnText.call(this, dataIndex, column, columnOrder);
            var description = _super.prototype.getColumnValue.call(this, dataIndex, IntelliTrace.StackFrameDataFields.Description, columnOrder);
            var hasParameter = _super.prototype.getColumnValue.call(this, dataIndex, IntelliTrace.StackFrameDataFields.HasParameters, columnOrder);
            var descriptionHeight = this.getFrameNameHeight(dataIndex);
            var nestedGridHeight = 0;
            var cellElement = null;
            var descriptionElement = null;
            var descriptionTextElement = null;
            var maxDescriptionTextElementWidth = 0;
            var debugEventLinkElementExtraClass = null;
            var selectedDataIndex = this.getSelectedDataIndex();
            // Use custom drawing only when data is ready, and data contains parameter or description 
            if (signature && signature !== "" && (hasParameter || (description && (description !== "")))) {
                // create the main cell element
                cellElement = _super.prototype.createElementWithClass.call(this, "div", "method-detail-grid-cell");
                cellElement.style.width = String(column.width) + "px";
                // create the element to hold the stack frame text, tree icon and the link.
                descriptionElement = _super.prototype.createElementWithClass.call(this, "div", CallDurationTree.BorderPlaceHolderClass);
                descriptionElement.style.width = String(column.width) + "px";
                descriptionElement.style.height = String(descriptionHeight - CallDurationTree.RowBorderHeight) + "px";
                // Add a tree-sign in front of the text and leave space for the expand icon
                var treeIcon = this.createElementWithClass("div", "icon floatleft " + CallDurationTree.MethodDetailExpandIconClass);
                treeIcon.setAttribute("role", "button");
                treeIcon.setAttribute("aria-label", Microsoft.Plugin.Resources.getString("ShowMethodDetailsButton"));
                descriptionElement.appendChild(treeIcon);
                descriptionTextElement = _super.prototype.createElementWithClass.call(this, "div", "grid-cell-nested-text floatleft " + CallDurationTree.DescriptionTextElementSelectionClass);
                descriptionTextElement.innerText = (description && description !== "") ? description : signature;
                descriptionTextElement.style.marginLeft = String(IntelliTrace.CustomGridControl.IconWidth) + "px";
                maxDescriptionTextElementWidth = column.width - IntelliTrace.CustomGridControl.IconWidth;
                descriptionElement.appendChild(descriptionTextElement);
                cellElement.appendChild(descriptionElement);
                debugEventLinkElementExtraClass = "grid-cell-action-div ";
                // It's possible that the data is not returned from the view model before layout begins.
                // This happens especially when there is a mouse over event on the row. That will trigger a layout.
                if (this._methodDetails.hasOwnProperty(dataIndex) && this._methodDetails[dataIndex].isExpanded && this._methodDetails[dataIndex].isDataReady) {
                    treeIcon.classList.add("method-detail-expanded");
                    treeIcon.setAttribute("aria-pressed", "true");
                    // ensure nested method detail element is created
                    this.ensureMethodDetailElementCreated(dataIndex);
                    var detailElement = this._methodDetails[dataIndex].detailElement;
                    cellElement.appendChild(detailElement);
                    nestedGridHeight = this._methodDetails[dataIndex].detailElementHeight;
                    cellElement.setAttribute("aria-expanded", "true");
                }
                else {
                    treeIcon.classList.add("method-detail-collapsed");
                    treeIcon.setAttribute("aria-pressed", "false");
                    cellElement.setAttribute("aria-expanded", "false");
                }
            }
            else {
                descriptionElement = this.createElementWithClass("div", this.options().cellClass + " " + CallDurationTree.BorderPlaceHolderClass);
                descriptionElement.style.width = String(column.width) + "px";
                descriptionElement.style.height = String(descriptionHeight) + "px";
                descriptionTextElement = this.createElementWithClass("div", "floatleft show-ellipsis " + CallDurationTree.DescriptionTextElementSelectionClass);
                maxDescriptionTextElementWidth = column.width;
                if (signature) {
                    descriptionTextElement.innerText = signature;
                }
                descriptionElement.appendChild(descriptionTextElement);
                cellElement = descriptionElement;
                debugEventLinkElementExtraClass = " ";
            }
            if (dataIndex === selectedDataIndex || dataIndex === this._dataIndexOfHoveredRow) {
                debugEventLinkElementExtraClass += CallDurationTree.VisibleElementClass;
            }
            else {
                debugEventLinkElementExtraClass += CallDurationTree.InvisibleElementClass;
            }
            var debugEventLinkElement = this.createDebugEventLinkElement(dataIndex, debugEventLinkElementExtraClass, dataIndex === selectedDataIndex);
            descriptionElement.appendChild(debugEventLinkElement);
            if (dataIndex === selectedDataIndex || dataIndex === this._dataIndexOfHoveredRow) {
                // The descriptionElement layout is float from left to right, then from top to bottom.
                // The child elements need to be on the same line. Without _debugEventLinkWidthAdjustment, the descriptionTextElement will be too
                // wide and push debugEventLinkElement to the next line.
                maxDescriptionTextElementWidth -= this.getDebugEventLinkWidth() + this._debugEventLinkWidthAdjustment;
                if (dataIndex === this._dataIndexOfHoveredRow && dataIndex !== selectedDataIndex) {
                    // show the hover effect.
                    descriptionElement.classList.add(CallDurationTree.RowHoverClass);
                }
            }
            descriptionTextElement.style.maxWidth = String(maxDescriptionTextElementWidth) + "px";
            if (this._methodDetails.hasOwnProperty(dataIndex)) {
                this._methodDetails[dataIndex].descriptionElement = descriptionElement;
            }
            rowInfo.row.style.height = String(descriptionHeight + nestedGridHeight) + "px";
            return cellElement;
        };
        /*protected*/ CallDurationTree.prototype._attachEvents = function () {
            var _this = this;
            _super.prototype._attachEvents.call(this);
            this.addEventListenerToCanvas("dblclick", this, this.onDbClick);
            this.addEventListenerToCanvas("mouseover", this, this.onMouseOver);
            // mouseleave event is IE only.
            this.addEventListenerToCanvas("mouseleave", this, this.onMouseLeave);
            this.addEventListenerToCanvas(IntelliTrace.CustomEvents.NestedGridControlHeightChanged, this, this.onNestedGridControlHeightChanged);
            this.addEventListenerToCanvas(IntelliTrace.CustomEvents.NestedGridControlHasMouseDown, this, this.onNestedGridControlMouseDown);
            var element = this.getElement();
            element.addEventListener("columnresize", function (e) {
                _this._onColumnResizeEvent(e.customData);
            });
        };
        CallDurationTree.prototype.onNestedGridControlHeightChanged = function (e) {
            var dataIndex = e.customData[0];
            this.handleNestedGridControlHeightChanged(dataIndex);
        };
        CallDurationTree.prototype.onNestedGridControlMouseDown = function (e) {
            var dataIndex = e.customData[0];
            var rowIndex = this._getRowIndex(dataIndex);
            this._clearSelection();
            this._addSelection(rowIndex, dataIndex);
            var methodDetail = this._methodDetails[dataIndex];
            if (methodDetail != null && methodDetail.isExpanded && methodDetail.gridControl != null) {
                this.selectedNestedGrid = methodDetail.gridControl;
                if (this._shouldSetFocusAfterMouseLeave) {
                    this.selectedNestedGrid.setFocusOnSelectedRow();
                    this._shouldSetFocusAfterMouseLeave = false;
                }
            }
        };
        CallDurationTree.prototype._onColumnResizeEvent = function (columns) {
            for (var i = 0; i < columns.length; ++i) {
                var column = columns[i];
                if (column === this._frameNameColumn) {
                    // get visible row range to decide whether we need to relayout the whole tree
                    var visibleIndices = _super.prototype.getVisibleRowIndices.call(this);
                    var firstIndex = visibleIndices.first;
                    var lastIndex = visibleIndices.last;
                    // magic number 3, peek the upper and lower rows and get the max indent
                    var predictedFirstIndex = Math.max(0, firstIndex - 3);
                    var maxIndex = _super.prototype.getExpandedCount.call(this);
                    var predictedLastIndex = Math.min(maxIndex, lastIndex + 3);
                    var needUpdate = false;
                    var minDataIndexToCalculateRowTops = -1; // -1 means not to calculate.
                    for (var j = 0; j < maxIndex; ++j) {
                        var dataIndex = _super.prototype._getDataIndex.call(this, j);
                        var methodDetail = this._methodDetails[dataIndex];
                        if (methodDetail && methodDetail.detailElement) {
                            methodDetail.detailElement.style.width = String(column.width) + "px";
                            if (methodDetail.gridControl) {
                                var parameterGridWidth = this.getParameterGridWidth();
                                methodDetail.gridControl.updateColumnWidths(parameterGridWidth);
                                methodDetail.isDirty = true;
                                // At this point, the nested grid control may not attach to the outer grid control.
                                // Instead of relying on the event NestedGridControlHeightChanged for re-calculation, 
                                // we need to calculate the height and row tops. That event will go nowhere since the nested grid control isn't in the DOM yet.
                                this.adjustMethodDetailElementHeight(dataIndex);
                                if (minDataIndexToCalculateRowTops === -1) {
                                    minDataIndexToCalculateRowTops = dataIndex;
                                }
                            }
                            if (methodDetail.isExpanded && j >= predictedFirstIndex && j <= predictedLastIndex) {
                                needUpdate = true;
                            }
                        }
                    }
                    if (minDataIndexToCalculateRowTops !== -1) {
                        var rowIndex = this._getRowIndex(minDataIndexToCalculateRowTops);
                        this.calcRowTops(rowIndex);
                    }
                    if (needUpdate) {
                        // need to redraw. Otherwise, the nested grid control will have scroll bar when the column shrinks.
                        _super.prototype.layout.call(this);
                    }
                }
            }
        };
        /*protected*/ CallDurationTree.prototype._onThemeChanged = function (e) {
            var _this = this;
            // Daytona has changed the CSS values when this event happens. IE may apply the change to DOM in later render pass.
            // While we redraw and relayout, we need to calculate the width of "Debug This Call" link.
            // The way we do it is create a div element, append it to DOM, and measure the width of the element.
            // we use a time out and hope the new CSS values are applied to DOM.
            setTimeout(function () {
                // reset these values so that they're recalculated after the theme is changed.
                _this._frameNameHeight = [];
                _this._debugEventLinkWidth = -1;
                _super.prototype._onThemeChanged.call(_this, e);
                _this.layoutAfterHeightChanged(0);
            }, 100);
        };
        /*protected*/ CallDurationTree.prototype.checkUpdateActive = function (rowInfo) {
            if (this.isSelectedGridHandleFocus()) {
                this.selectedNestedGrid.setActiveRow();
                return;
            }
            _super.prototype.checkUpdateActive.call(this, rowInfo);
        };
        /* protected */ CallDurationTree.prototype._onFocus = function (e) {
            if (!this.isSelectedGridHandleFocus()) {
                return _super.prototype._onFocus.call(this, e);
            }
        };
        /* protected */ CallDurationTree.prototype._onRowElementFocus = function (e) {
            if (!this.isSelectedGridHandleFocus()) {
                return _super.prototype._onRowElementFocus.call(this, e);
            }
        };
        /*protected*/ CallDurationTree.prototype._onBlur = function (e) {
            _super.prototype._onBlur.call(this, e);
            this.removeMouseHoverOnHoveredRow();
        };
        /* protected */ CallDurationTree.prototype._updateAriaAttribute = function () {
            if (!this.isSelectedGridHandleFocus()) {
                _super.prototype._updateAriaAttribute.call(this);
            }
        };
        /*protected*/ CallDurationTree.prototype._onRowMouseDown = function (e) {
            this._lastClickOnTreeIcon = false;
            this._shouldSetFocusAfterMouseLeave = false;
            var rowInfo = this.getRowInfoFromEvent(e, "." + this.options().rowClass);
            if (rowInfo) {
                var targetElement = e.target;
                if (e.which === 1) {
                    if (targetElement.classList.contains(CallDurationTree.MethodDetailExpandIconClass)) {
                        this._lastClickOnTreeIcon = true;
                        this.toggleMethodDetail(rowInfo);
                    }
                    else if (targetElement.classList.contains("grid-tree-icon")) {
                        this._lastClickOnTreeIcon = true;
                    }
                    else {
                        this.selectedNestedGrid = null;
                    }
                    _super.prototype._onRowMouseDown.call(this, e);
                }
            }
        };
        CallDurationTree.prototype.onMouseOver = function (e) {
            var rowInfo = this.getRowInfoFromEvent(e, "." + this.options().rowClass);
            if (rowInfo) {
                if (this._dataIndexOfHoveredRow !== rowInfo.dataIndex) {
                    var previousDataIndexOfHoveredRow = this._dataIndexOfHoveredRow;
                    this._dataIndexOfHoveredRow = rowInfo.dataIndex;
                    if (previousDataIndexOfHoveredRow !== this.getSelectedDataIndex()) {
                        this.removeMouseHoverAtDataIndex(previousDataIndexOfHoveredRow);
                    }
                    if (this._dataIndexOfHoveredRow !== this.getSelectedDataIndex()) {
                        this.addMouseHoverOnRow(rowInfo);
                    }
                    else {
                        // There is not hovered row, reset the index.
                        this._dataIndexOfHoveredRow = CallDurationTree.InvalidDataIndexForSelection;
                    }
                }
            }
        };
        CallDurationTree.prototype.onMouseLeave = function (e) {
            this.removeMouseHoverOnHoveredRow();
            this._shouldSetFocusAfterMouseLeave = true;
        };
        // start debugging on double clicking an item
        CallDurationTree.prototype.onDbClick = function (e) {
            if (this._lastClickOnTreeIcon) {
                // Inadvertly double clicking on tree glyph and causing debugging proved to be a confusing experience
                // To workaround this, if the last click is on tree glyph, ignore this double click
                this._lastClickOnTreeIcon = false;
            }
            else {
                var rowInfo = this.getRowInfoFromEvent(e, "." + this.options().rowClass);
                if (rowInfo) {
                    var methodDetail = this._methodDetails[rowInfo.dataIndex];
                    var detailElement = this.findClosestElement(e.target, ".grid-method-detail");
                    if (methodDetail != null && detailElement === methodDetail.detailElement) {
                    }
                    else {
                        this._adapter._call(IntelliTrace.AdapterCalls.StartDebugging, rowInfo.dataIndex);
                    }
                }
            }
        };
        CallDurationTree.prototype.toggleMethodDetail = function (rowInfo) {
            var _this = this;
            var methodDetail = this._methodDetails[rowInfo.dataIndex];
            if (methodDetail) {
                // toggle method detail expand state when clicking on the expand icon
                methodDetail.isExpanded = !methodDetail.isExpanded;
                if (methodDetail.isExpanded) {
                    // redraw when method detail data is ready
                    this.fetchMethodDetailAndRedraw(rowInfo.dataIndex, function () {
                        _this.layoutAfterHeightChanged(rowInfo.rowIndex);
                    });
                }
                else {
                    this.layoutAfterHeightChanged(rowInfo.rowIndex);
                }
            }
        };
        // Return true if the keyboard event is not processed
        /*protected*/ CallDurationTree.prototype._onKeyDown = function (e) {
            // Let the base class handle tabbing, so that we can tab out of the tree.
            if (e.keyCode == Common.KeyCodes.TAB) {
                return _super.prototype._onKeyDown.call(this, e);
            }
            e.preventDefault(); // especially preventing space bar scrolling the view.
            this._shouldSetFocusAfterMouseLeave = false;
            if ((this.getSelectedRowIndex() < 0) && (this.getExpandedCount() > 0)) {
                _super.prototype._addSelection.call(this, 0);
            }
            if ((e.keyCode === Common.KeyCodes.PAGE_DOWN) || (e.keyCode === Common.KeyCodes.PAGE_UP)) {
                this.handlePageUpPageDown(e);
                return false;
            }
            // If selected item has details space will toggle expand
            if (e.keyCode == Common.KeyCodes.SPACE) {
                this.handleKeyCodeSpace();
                return false;
            }
            if (e.keyCode === Common.KeyCodes.ENTER && this.selectedNestedGrid == null) {
                this._adapter._call(IntelliTrace.AdapterCalls.StartDebugging, this.getSelectedDataIndex());
                return false;
            }
            var handledResult = EventHandlingResult.NONE;
            // Up/Down key may navigate from outer grid into nested grid
            if ((e.keyCode == Common.KeyCodes.ARROW_UP) || (e.keyCode == Common.KeyCodes.ARROW_DOWN)) {
                handledResult = this.handleKeyCodeUpDown(e);
            }
            // Ask whether a nested grid wants to handle the event
            if (handledResult === EventHandlingResult.NONE
                && ((e.keyCode == Common.KeyCodes.ARROW_UP) || (e.keyCode == Common.KeyCodes.ARROW_DOWN)
                    || (e.keyCode == Common.KeyCodes.ARROW_LEFT) || (e.keyCode == Common.KeyCodes.ARROW_RIGHT)
                    || (e.keyCode == Common.KeyCodes.ENTER))) {
                handledResult = this.handleByNestedGrid(e);
            }
            var result = false;
            switch (handledResult) {
                case EventHandlingResult.NONE:
                    this._updateSelectionStyles();
                    result = _super.prototype._onKeyDown.call(this, e);
                    break;
                case EventHandlingResult.COMPLETE:
                    result = true;
                    break;
                case EventHandlingResult.PARTIAL:
                    if (this._selectedNestedGrid === null) {
                        var rowInfo = this.getRowInfo(this.getSelectedDataIndex());
                        this.checkUpdateActive(rowInfo);
                        this._updateSelectionStyles();
                        this.getSelectedRowIntoView();
                    }
                    result = true;
                    break;
                default:
                    result = false;
                    break;
            }
            return result;
        };
        // Handle SPACE keyboard events
        // Return true if the keyboard event is handled
        CallDurationTree.prototype.handleKeyCodeSpace = function () {
            var selectedDataIndex = this.getSelectedDataIndex();
            if (selectedDataIndex < 0) {
                return false;
            }
            if (this._methodDetails.hasOwnProperty(selectedDataIndex)) {
                var methodDetail = this._methodDetails[selectedDataIndex];
                this.toggleMethodDetail(_super.prototype.getRowInfo.call(this, selectedDataIndex));
                // Set selection to nested grid control
                if (methodDetail.isExpanded && methodDetail.gridControl) {
                    this.selectedNestedGrid = methodDetail.gridControl;
                }
                else {
                    this.selectedNestedGrid = null;
                    var rowInfo = this.getRowInfo(selectedDataIndex);
                    this.checkUpdateActive(rowInfo);
                }
                return true;
            }
            return false;
        };
        // If there is no nested grid selected, UP/DOWN key may cause one getting selected
        // Return true if the keyboard event is handled
        CallDurationTree.prototype.handleKeyCodeUpDown = function (e) {
            if (this.selectedNestedGrid) {
                return EventHandlingResult.NONE;
            }
            var selectedRowIndex = this.getSelectedRowIndex();
            var selectedDataIndex = this.getSelectedDataIndex();
            if ((selectedRowIndex < 0) || (selectedDataIndex < 0)) {
                return EventHandlingResult.NONE;
            }
            if ((e.keyCode == Common.KeyCodes.ARROW_DOWN) && this._methodDetails.hasOwnProperty(selectedDataIndex)) {
                // If ARROW_DOWN and the nested grid of current row is expanded
                var methodDetail = this._methodDetails[selectedDataIndex];
                if (methodDetail.isExpanded && methodDetail.gridControl) {
                    this.selectedNestedGrid = methodDetail.gridControl;
                    this.selectedNestedGrid._clearSelection();
                    this.selectedNestedGrid._addSelection(0);
                    this.selectedNestedGrid.getSelectedRowIntoView();
                    return EventHandlingResult.COMPLETE;
                }
            }
            else if ((e.keyCode == Common.KeyCodes.ARROW_UP) && (selectedRowIndex > 0)) {
                var previousDataIndex = this._getDataIndex(selectedRowIndex - 1);
                if (previousDataIndex >= 0 && this._methodDetails.hasOwnProperty(previousDataIndex)) {
                    // If ARROW_UP and the nested grid of previous row is expanded
                    var methodDetail = this._methodDetails[previousDataIndex];
                    if (methodDetail.isExpanded && methodDetail.gridControl) {
                        this._clearSelection();
                        this._addSelection(selectedRowIndex - 1);
                        this.selectedNestedGrid = methodDetail.gridControl;
                        this.selectedNestedGrid._clearSelection();
                        this.selectedNestedGrid._addSelection(this.selectedNestedGrid.getExpandedCount() - 1);
                        this.selectedNestedGrid.getSelectedRowIntoView();
                        return EventHandlingResult.COMPLETE;
                    }
                }
            }
            return EventHandlingResult.NONE;
        };
        // If a nested grid is selected, let it handle ARROW_LEFT, ARROW_RIGHT, ARROW_UP, ARROW_DOWN keyboard events
        // Return true if the keyboard event is handled
        CallDurationTree.prototype.handleByNestedGrid = function (e) {
            var selectedDataIndex = this.getSelectedDataIndex();
            if (selectedDataIndex < 0) {
                return EventHandlingResult.NONE;
            }
            // If there is already a selected nested grid, check whether it should handle the event
            if (this.selectedNestedGrid && this._methodDetails.hasOwnProperty(selectedDataIndex)) {
                var methodDetail = this._methodDetails[selectedDataIndex];
                if (methodDetail.isExpanded && methodDetail.gridControl && (methodDetail.gridControl == this.selectedNestedGrid))
                    if (methodDetail.gridControl.handleKeyDownEventInOuterGrid(e)) {
                        if ((e.keyCode === Common.KeyCodes.ARROW_UP) || (e.keyCode === Common.KeyCodes.ARROW_LEFT)) {
                            // currently it always because keyboard trying to navigate out of nested grid
                            this.selectedNestedGrid = null;
                            // If keyboard is going up, keep current item selected and return.
                            // (and selection style will go from nested grid to method name)
                            return EventHandlingResult.PARTIAL;
                        }
                        else {
                            // (e.keyCode === Common.KeyCodes.ARROW_DOWN || (e.keyCode === Common.KeyCodes.ARROW_RIGHT))
                            // if the selectedNestedGrid is at the last row of the outer grid, return COMPLETE so that the outer grid doesn't handle
                            // this event. If the outer grid handles the event in this case, it will select the same row which is the last row
                            // and highlight the descriptionElement. This causes the cycling effect: the highlighting is going from the last row
                            // back to the beginning.
                            var selectedRowIndex = this._getRowIndex(selectedDataIndex);
                            if (selectedRowIndex === this.getExpandedCount() - 1) {
                                return EventHandlingResult.COMPLETE;
                            }
                            else {
                                // it's navigating out of the nested grid.
                                this.selectedNestedGrid = null;
                                return EventHandlingResult.NONE;
                            }
                        }
                    }
                    else {
                        // Nested grid handled the keyboard event
                        return EventHandlingResult.COMPLETE;
                    }
            }
            return EventHandlingResult.NONE;
        };
        CallDurationTree.prototype.handlePageUpPageDown = function (e) {
            if (e.shiftKey || e.ctrlKey) {
            }
            var newScrollTop = this.getCanvas().scrollTop;
            var clientHeight = this.getCanvas().clientHeight;
            var newSelectedRowIndex = 0;
            if (e.keyCode === Common.KeyCodes.PAGE_DOWN) {
                newScrollTop += clientHeight;
                var totalHeight = this.getTotalDataHeight();
                if (newScrollTop > totalHeight - clientHeight) {
                    newScrollTop = totalHeight - clientHeight;
                }
                var currentSelectedRowIndex = this.getSelectedRowIndex();
                newSelectedRowIndex = currentSelectedRowIndex;
                for (var i = currentSelectedRowIndex; i < this.getExpandedCount(); ++i) {
                    if (this.getRowBottom(i) >= newScrollTop) {
                        newSelectedRowIndex = i;
                        break;
                    }
                }
            }
            else {
                newScrollTop -= clientHeight;
                if (newScrollTop < 0) {
                    newScrollTop = 0;
                }
                var currentSelectedRowIndex = this.getSelectedRowIndex();
                newSelectedRowIndex = currentSelectedRowIndex;
                for (var i = currentSelectedRowIndex; i >= 0; --i) {
                    if (this.getRowTop(i) <= newScrollTop) {
                        newSelectedRowIndex = i;
                        break;
                    }
                }
            }
            var currentSelectedRowIndex = this.getSelectedRowIndex();
            if (newSelectedRowIndex !== currentSelectedRowIndex) {
                this._clearSelection();
                this._addSelection(newSelectedRowIndex);
                this.selectedNestedGrid = null;
            }
            if (this.getCanvas().scrollTop != newScrollTop) {
                this.getCanvas().scrollTop = newScrollTop;
            }
        };
        /// <param name="dataIndex">The dataIndex for the row where debug event link element is in</param>
        /// <param name="extraClass">Extra CSS class to the new created debug event link element</param>
        /// <param name="isSelected">Whether <paramref="dataIndex"/> is selected</param>
        CallDurationTree.prototype.createDebugEventLinkElement = function (dataIndex, extraClass, isSelected) {
            var _this = this;
            var debugLinkContainerElement = this.createElementWithClass("div");
            if (extraClass === null) {
                extraClass = "";
            }
            debugLinkContainerElement.className = extraClass + " debug-link-offset floatleft " + CallDurationTree.DebugLinkSelectionClass;
            if (isSelected != null && isSelected) {
                // When dataIndex is selected but selectedNestedGrid is null, the descriptionElement is selected. We'll use the class calltree-hyperlink-selected.
                // Otherwise we'll use hyperlink.
                if (this.selectedNestedGrid == null) {
                    debugLinkContainerElement.classList.add(CallDurationTree.DottedBorder);
                    debugLinkContainerElement.classList.add(CallDurationTree.SelectedLinkClass);
                }
                else {
                    debugLinkContainerElement.classList.add(CallDurationTree.BorderPlaceHolderClass);
                    debugLinkContainerElement.classList.add(CallDurationTree.NonSelectedLinkClass);
                }
            }
            else {
                debugLinkContainerElement.classList.add(CallDurationTree.BorderPlaceHolderClass);
                debugLinkContainerElement.classList.add(CallDurationTree.MouseOverLinkClass);
            }
            var linkElement = this.createElementWithClass("a");
            linkElement.innerText = Microsoft.Plugin.Resources.getString("DebugThisCall");
            debugLinkContainerElement.appendChild(linkElement);
            this._addMouseUpListener(linkElement, 0, function (e) { _this._adapter._call(IntelliTrace.AdapterCalls.StartDebugging, dataIndex); });
            return debugLinkContainerElement;
        };
        /* protect */ CallDurationTree.prototype.getRowHeight = function (rowIndex) {
            if ((rowIndex < 0) || (this.getExpandedCount() <= rowIndex)) {
                return 0;
            }
            var dataIndex = this._getDataIndex(rowIndex);
            var height = this.getFrameNameHeight(dataIndex);
            if (this._methodDetails.hasOwnProperty(dataIndex)) {
                var methodDetail = this._methodDetails[dataIndex];
                if (methodDetail.isExpanded) {
                    height += this._methodDetails[dataIndex].detailElementHeight;
                }
            }
            return height;
        };
        /*protected*/ CallDurationTree.prototype._updateViewport = function (includeNonDirtyRows) {
            // Try to widen the total time column if necessary
            if (!this._stopAutoResizing && (CallDurationTree.MaxTotalTimeColumnWidth > this._callDurationColumn.width)) {
                var maxWidth = this.getTotalTimeColumnMaxVisibleWidth();
                var visibleMaxWidth = maxWidth.visible;
                var predictedMaxWidth = maxWidth.predicted;
                if (visibleMaxWidth > this._callDurationColumn.width) {
                    var headerWidth = this.getVisibleWidth();
                    this._callDurationColumn.width = Math.min(predictedMaxWidth, CallDurationTree.MaxTotalTimeColumnWidth);
                    this.adjustWidth(headerWidth, this._callDurationColumn.width);
                    this.scheduleLayout();
                    // scheduleLayout() will remove everything and draw the
                    // view again. Don't need to continue to update the view
                    // port this time.
                    return;
                }
            }
            _super.prototype._updateViewport.call(this, includeNonDirtyRows);
        };
        CallDurationTree.prototype.selectedIndexChanged = function (selectedRowIndex, selectedDataIndex) {
            if (this._methodDetails != null
                && (!this._methodDetails.hasOwnProperty(selectedDataIndex)
                    || this._methodDetails[selectedDataIndex].gridControl !== this.selectedNestedGrid)) {
                this.selectedNestedGrid = null;
            }
            var hiddenElement = this.hideDebugLinkAtDataIndex(this._lastSelectedDataIndex);
            this.removeHyperlinkStyle(hiddenElement);
            if (this._dataIndexOfHoveredRow === selectedDataIndex) {
                // When it's caused by mouse, it's possible there is a mouse
                // over event before mouse down. Remove the mouse hovered
                // style.
                this.removeMouseHoverAtDataIndex(this._dataIndexOfHoveredRow);
                this._dataIndexOfHoveredRow = CallDurationTree.InvalidDataIndexForSelection;
            }
            var shownElement = this.showDebugLinkAtDataIndex(selectedDataIndex);
            this.addHyperlinkStyle(shownElement, this.isActive(), true, false);
            this._lastSelectedDataIndex = selectedDataIndex;
        };
        /*protected*/ CallDurationTree.prototype._applyColumnSizing = function (columnIndex, initialWidth, finish) {
            this._stopAutoResizing = true;
            _super.prototype._applyColumnSizing.call(this, columnIndex, initialWidth, finish);
        };
        // For rows with method detail expanded, we have different selection style
        /*protected*/ CallDurationTree.prototype._updateRowSelectionStyle = function (rowInfo, selectedRows, focusIndex) {
            var dataIndex = rowInfo.dataIndex;
            var row = rowInfo.row;
            if (row == null) {
                return;
            }
            row.setAttribute("aria-selected", "false");
            var debugLinkElement = CallDurationTree.getFirstElementByClassName(row, CallDurationTree.DebugLinkSelectionClass);
            if (debugLinkElement != null) {
                this.removeHyperlinkStyle(debugLinkElement);
                var isSelected = ((dataIndex === this.getSelectedDataIndex()) && (this.selectedNestedGrid === null));
                var isActive = this.isActive();
                var isHover = (dataIndex === this._dataIndexOfHoveredRow);
                this.addHyperlinkStyle(debugLinkElement, isActive, isSelected, isHover);
            }
            // The highlighted text should use normal text color when row is selected
            var highlight = _super.prototype.getColumnValue.call(this, dataIndex, IntelliTrace.StackFrameDataFields.Highlight, 0);
            if (highlight) {
                var cellElement = CallDurationTree.getFirstElementByClassName(row, CallDurationTree.HighlightCellClass);
                if (cellElement != null) {
                    cellElement.classList.remove(CallDurationTree.HighlightTextClass);
                    cellElement.classList.remove(CallDurationTree.HighlightTextClassSelected);
                    if (selectedRows && selectedRows.hasOwnProperty(rowInfo.rowIndex)) {
                        cellElement.classList.add(CallDurationTree.HighlightTextClassSelected);
                    }
                    else {
                        cellElement.classList.add(CallDurationTree.HighlightTextClass);
                    }
                }
            }
            if (!this._methodDetails.hasOwnProperty(dataIndex)) {
                // call default row selection style
                _super.prototype._updateRowSelectionStyle.call(this, rowInfo, selectedRows, focusIndex);
            }
            else {
                var rowIndex = rowInfo.rowIndex;
                var isSelected = selectedRows && selectedRows.hasOwnProperty(rowIndex) && (!this.selectedNestedGrid);
                var isChildSelected = this._methodDetails[dataIndex].gridControl && (this._methodDetails[dataIndex].gridControl === this.selectedNestedGrid);
                if (isSelected || isChildSelected) {
                    row.setAttribute("aria-selected", "true");
                }
                // There are 2 areas need to be styled separately
                // 1) call duration cell
                var callDurationElement = this._methodDetails[dataIndex].callDurationElement;
                if (callDurationElement) {
                    callDurationElement.classList.remove(this.options().rowSelectedClass);
                    callDurationElement.classList.remove(CallDurationTree.BorderPlaceHolderClass);
                    callDurationElement.classList.remove("call-duration-child-selected");
                    if (isSelected) {
                        callDurationElement.classList.add(this.options().rowSelectedClass);
                    }
                    else if (isChildSelected) {
                        callDurationElement.classList.add("call-duration-child-selected");
                    }
                    else {
                        callDurationElement.classList.add(CallDurationTree.BorderPlaceHolderClass);
                    }
                }
                // 2) The top area of the name cell
                var nameElement = this._methodDetails[dataIndex].descriptionElement;
                if (nameElement) {
                    nameElement.classList.remove(this.options().rowSelectedClass);
                    nameElement.classList.remove(CallDurationTree.BorderPlaceHolderClass);
                    nameElement.classList.remove("frame-name-child-selected");
                    if (isSelected) {
                        nameElement.classList.add(this.options().rowSelectedClass);
                    }
                    else if (isChildSelected) {
                        nameElement.classList.add("frame-name-child-selected");
                    }
                    else {
                        nameElement.classList.add(CallDurationTree.BorderPlaceHolderClass);
                    }
                }
            }
        };
        CallDurationTree.prototype.getSelectedRowIntoView = function (force) {
            var selectedRowIndex = this.getSelectedRowIndex();
            var canvas = this.getCanvas();
            if (force) {
                // update view port will be called when scrolling happen
                var index = Math.max(0, Math.min(selectedRowIndex || 0, this.getExpandedCount() - 1));
                canvas.scrollTop = this.getRowTop(index);
                return true;
            }
            var viewportTop = canvas.scrollTop;
            var viewportHeight = canvas.clientHeight;
            var viewportBottom = viewportTop + viewportHeight;
            var rowTopOfSelectedRow = this.getRowTop(selectedRowIndex);
            var rowHeightOfSelectedRow = this.getRowHeight(selectedRowIndex);
            // If partial row is in the view, will try to bring the top of the row into view to show more information.
            if (rowTopOfSelectedRow < viewportTop) {
                canvas.scrollTop = rowTopOfSelectedRow;
            }
            else if (rowTopOfSelectedRow + rowHeightOfSelectedRow >= viewportBottom) {
                // Try to show the selected row as the last visible row in the view. Align the bottom of the row with the bottom of the view.
                // If the row is taller than the view height, align the top of the row with the top of the view. 
                var offset = rowHeightOfSelectedRow - viewportHeight;
                if (offset > 0) {
                    offset = 0;
                }
                canvas.scrollTop = rowTopOfSelectedRow + offset;
            }
        };
        CallDurationTree.prototype.collapseAllNodes = function () {
            var isCollapsed = _super.prototype.collapseAllNodes.call(this);
            var count = this.getExpandStates().length;
            for (var i = 0; i < count; ++i) {
                var methodDetail = this._methodDetails[i];
                if (methodDetail != null) {
                    methodDetail.isExpanded = false;
                }
            }
            this.calcRowTops(0);
            return isCollapsed;
        };
        CallDurationTree.prototype.expandAll = function () {
            _super.prototype.expandAll.call(this);
            this.getSelectedRowIntoView();
        };
        /* protected */ CallDurationTree.prototype._getAriaLabelForRow = function (rowInfo) {
            var rowIndex = rowInfo.rowIndex;
            var dataIndex = rowInfo.dataIndex;
            var columns = this.getColumns();
            var ariaLabel = columns[0].text + ", " + this.getColumnText(dataIndex, columns[0], null) + ", ";
            var description = this.getColumnValue(dataIndex, IntelliTrace.StackFrameDataFields.Description, null);
            var hasDescription = (description != null) && (description !== "");
            if (hasDescription) {
                var descriptionTitle = Microsoft.Plugin.Resources.getString("FrameDescription");
                ariaLabel += descriptionTitle + ", " + description + ", ";
            }
            else {
                ariaLabel += columns[1].text + ", " + this.getColumnText(dataIndex, columns[1], null) + ", ";
            }
            if (this._methodDetails.hasOwnProperty(dataIndex)) {
                var parameterGridTitle = Microsoft.Plugin.Resources.getString("ParameterGrid");
                if (this._methodDetails[dataIndex].isExpanded) {
                    if (hasDescription) {
                        ariaLabel += columns[1].text + ", " + this.getColumnText(dataIndex, columns[1], null) + ", ";
                    }
                    var expanded = Microsoft.Plugin.Resources.getString("ParameterGridExpanded");
                    ariaLabel += parameterGridTitle + ", " + expanded + ", ";
                }
                else {
                    var collapsed = Microsoft.Plugin.Resources.getString("ParameterGridCollapsed");
                    ariaLabel += parameterGridTitle + ", " + collapsed + ", ";
                }
            }
            ariaLabel += Microsoft.Plugin.Resources.getString("DebugThisCall") + ", " + Microsoft.Plugin.Resources.getString("Link");
            return ariaLabel;
        };
        /// Make item with dataIndex visible, which expand all the items on the path from tree root to dataIndex, 
        /// expand the first level of parameter for dataIndex, and bring item into the center of the view
        CallDurationTree.prototype.expandItemByDataIndex = function (dataIndex) {
            var _this = this;
            var expandStates = _super.prototype.getExpandStates.call(this);
            var totalCount = expandStates.length;
            var needUpdate = false;
            this.focus(0); // move the focus to CallDurationTree.
            var bringIntoCenter = function () {
                _super.prototype.setSelectedDataIndex.call(_this, dataIndex, false);
                // Always highlight the description even though one row in the nested grid is selected. This makes it obvious that the method is
                // selected when the user clicks "Find in Tree".
                _this.selectedNestedGrid = null;
                _this.getSelectedRowIntoViewCenter();
            };
            if (dataIndex >= 0 && dataIndex < totalCount) {
                if (this._selectedSlowestNodeDataIndex !== dataIndex) {
                    this._selectedSlowestNodeDataIndex = dataIndex;
                    needUpdate = true;
                }
                var minDataIndexForRecalculation = -1; // -1 means no need to recalculate.
                for (var i = 0; i < dataIndex; ++i) {
                    if ((Math.abs(expandStates[i]) + i) >= dataIndex) {
                        if (expandStates[i] < 0) {
                            this.expandNode(i);
                            needUpdate = true;
                        }
                    }
                    else if (expandStates[i] > 0) {
                        this.collapseNode(i);
                        needUpdate = true;
                    }
                    var toCollapsedMethodDetail = this._methodDetails[i];
                    if (toCollapsedMethodDetail != null && toCollapsedMethodDetail.isExpanded) {
                        toCollapsedMethodDetail.isExpanded = false;
                        if (minDataIndexForRecalculation === -1) {
                            minDataIndexForRecalculation = i;
                        }
                    }
                }
                if (minDataIndexForRecalculation !== -1) {
                    var rowIndex = this._getRowIndex(minDataIndexForRecalculation);
                    this.calcRowTops(rowIndex);
                    needUpdate = true;
                }
                this.selectedNestedGrid = null; // No rows in nested grid should be selected.
                // expand the first level of method detail
                var methodDetail = this._methodDetails[dataIndex];
                if (methodDetail && !methodDetail.isExpanded) {
                    methodDetail.isExpanded = true;
                    // can't call getRowInfo(DataIndex) since the row may not be generated yet
                    this.fetchMethodDetailAndRedraw(dataIndex, function () {
                        var rowIndex = _this._getRowIndex(dataIndex);
                        _this.layoutAfterHeightChanged(rowIndex);
                        bringIntoCenter();
                    });
                }
                else {
                    if (needUpdate) {
                        this.layout();
                    }
                    bringIntoCenter();
                }
            }
        };
        ///
        /// Start Private Helpers
        ///
        /// Helper function to create a custom drawing cell element with specified icon, tree icon, indent and text
        CallDurationTree.prototype.createMethodDetailGridControl = function (dataIndex, root) {
            var _this = this;
            var dataSource = this._methodDetails[dataIndex].parameterData;
            var outterGridRowData = this.getRowData(dataIndex);
            var hasAction = outterGridRowData[IntelliTrace.StackFrameDataFields.HasAction];
            var gridWidth = this.getParameterGridWidth();
            var control = new IntelliTrace.NestedGridControl(this._adapter, root, dataSource, this, gridWidth, dataIndex, hasAction);
            root.addEventListener(Common.Controls.Grid.GridControl.EVENT_ROW_EXPANDED_COLLAPSED, function (e) {
                if (e) {
                    var rowInfo = _super.prototype.getRowInfoFromEvent.call(_this, e, "." + _this.options().rowClass);
                    if (rowInfo) {
                        var dataIndex = rowInfo.dataIndex;
                        _this.handleNestedGridControlHeightChanged(dataIndex);
                    }
                    // stop the event from bubbling to parent treegrid
                    e.cancelBubble = true;
                }
            });
            return control;
        };
        CallDurationTree.prototype.adjustMethodDetailElementHeight = function (dataIndex) {
            var methodDetail = this._methodDetails[dataIndex];
            if (methodDetail) {
                var methodDetailElement = this._methodDetails[dataIndex].detailElement;
                if (methodDetailElement) {
                    var signatureHeight = 0;
                    var gridHeight = 0;
                    // create description message
                    var signature = _super.prototype.getColumnValue.call(this, dataIndex, IntelliTrace.StackFrameDataFields.Signature, 0);
                    var signatureElement = this._methodDetails[dataIndex].signatureElement;
                    if (signatureElement && signature && signature != "") {
                        signatureHeight = this.getMultilineTextHeight(signature);
                        signatureElement.style.height = String(signatureHeight) + "px";
                    }
                    var hasParameter = _super.prototype.getColumnValue.call(this, dataIndex, IntelliTrace.StackFrameDataFields.HasParameters, 0);
                    var nestedGridControl = this._methodDetails[dataIndex].gridControl;
                    if (typeof hasParameter === "boolean" && hasParameter && nestedGridControl) {
                        gridHeight = nestedGridControl.getTotalDataHeight() + _super.prototype.getHeaderHeight.call(this) + 4; // 4 for grid border and padding;
                        nestedGridControl.rootElement.style.height = String(gridHeight) + "px";
                    }
                    this._methodDetails[dataIndex].signatureHeight = signatureHeight;
                    var detailElementHeight = signatureHeight + gridHeight;
                    this._methodDetails[dataIndex].detailElementHeight = detailElementHeight;
                    methodDetailElement.style.height = String(detailElementHeight) + "px";
                }
            }
        };
        CallDurationTree.prototype.fetchMethodDetailAndRedraw = function (dataIndex, redraw) {
            var _this = this;
            if (this._methodDetails.hasOwnProperty(dataIndex)) {
                var hasParameter = _super.prototype.getColumnValue.call(this, dataIndex, IntelliTrace.StackFrameDataFields.HasParameters, 0);
                if (hasParameter && !this._methodDetails[dataIndex].parameterData) {
                    this._adapter._call(IntelliTrace.AdapterCalls.GetParameters, dataIndex).done(function (result) {
                        _this._methodDetails[dataIndex].parameterData = (result);
                        _this._methodDetails[dataIndex].isDataReady = true;
                        if (result) {
                            _this.ensureMethodDetailElementCreated(dataIndex);
                            _this._methodDetails[dataIndex].isDirty = true;
                            if (redraw) {
                                redraw();
                            }
                        }
                    });
                }
                else {
                    this.ensureMethodDetailElementCreated(dataIndex);
                    this._methodDetails[dataIndex].isDirty = true;
                    if (redraw) {
                        redraw();
                    }
                }
            }
        };
        CallDurationTree.prototype.ensureMethodDetailElementCreated = function (dataIndex) {
            if (this._methodDetails.hasOwnProperty(dataIndex) && this._methodDetails[dataIndex].isDataReady) {
                var methodDetail = this._methodDetails[dataIndex];
                if (methodDetail) {
                    if (!methodDetail.detailElement) {
                        var detailElement = _super.prototype.createElementWithClass.call(this, "div", "grid-method-detail");
                        detailElement.style.width = String(this._frameNameColumn.width) + "px";
                        // create description message
                        var description = _super.prototype.getColumnValue.call(this, dataIndex, IntelliTrace.StackFrameDataFields.Description, 0);
                        var signature = _super.prototype.getColumnValue.call(this, dataIndex, IntelliTrace.StackFrameDataFields.Signature, 0);
                        var signatureElement = null;
                        if (description && description !== "" && signature && signature !== "") {
                            // show signature in method detail when description exist
                            signatureElement = _super.prototype.createElementWithClass.call(this, "div", "grid-cell-nested-text " + CallDurationTree.SignatureElementSelectionClass);
                            signatureElement.innerText = signature;
                            detailElement.appendChild(signatureElement);
                        }
                        // create nested grid
                        var hasParameter = _super.prototype.getColumnValue.call(this, dataIndex, IntelliTrace.StackFrameDataFields.HasParameters, 0);
                        var gridControl = null;
                        if (typeof hasParameter === "boolean" && hasParameter) {
                            var gridElement = _super.prototype.createElementWithClass.call(this, "div");
                            gridControl = this.createMethodDetailGridControl(dataIndex, gridElement);
                            detailElement.appendChild(gridElement);
                        }
                        this._methodDetails[dataIndex].detailElement = detailElement;
                        this._methodDetails[dataIndex].signatureElement = signatureElement;
                        this._methodDetails[dataIndex].gridControl = gridControl;
                    }
                    this.adjustMethodDetailElementHeight(dataIndex);
                }
            }
        };
        CallDurationTree.prototype.getElementStyleHeight = function (element) {
            return element ? parseInt(element.style.height.slice(0, -2)) : 0;
        };
        CallDurationTree.prototype.layoutAfterHeightChanged = function (rowIndex) {
            this.calcRowTops(rowIndex);
            this.layout();
        };
        // Get the max desired width of the total time column for visible rows
        // This function will calculate 2 max column width values; one only includes all the visible rows, and the other includes additional 
        // upper/lower 3 rows plus the visible rows, this cache will decrease the frequency of re-layout when user scrolling through the rows
        CallDurationTree.prototype.getTotalTimeColumnMaxVisibleWidth = function () {
            var maxIndex = _super.prototype.getExpandedCount.call(this);
            var visibleIndices = _super.prototype.getVisibleRowIndices.call(this);
            var firstIndex = visibleIndices.first;
            var lastIndex = visibleIndices.last;
            // magic number 3, peek the upper and lower rows and get the max indent
            var predictedFirstIndex = Math.max(0, firstIndex - 3);
            var predictedLastIndex = Math.min(maxIndex, lastIndex + 3);
            var maxIndentLevel = 0;
            var predictedMaxIndentLevel = 0;
            for (var i = predictedFirstIndex; i <= predictedLastIndex; ++i) {
                var dataIndex = _super.prototype._getDataIndex.call(this, i);
                var indent = _super.prototype.indentLevel.call(this, dataIndex);
                if (predictedMaxIndentLevel < indent) {
                    predictedMaxIndentLevel = indent;
                }
                if ((maxIndentLevel < indent) && (i > firstIndex) && (i <= lastIndex)) {
                    maxIndentLevel = indent;
                }
            }
            return {
                visible: this.calcTotalTimeColumnWidth(maxIndentLevel),
                predicted: this.calcTotalTimeColumnWidth(predictedMaxIndentLevel)
            };
        };
        CallDurationTree.prototype.calcTotalTimeColumnWidth = function (indentLevel) {
            // This width should make the tree icon and total time visible
            return _super.prototype.getColumnPixelIndent.call(this, indentLevel) + 80; // magic number, should be enough for most total time string
        };
        CallDurationTree.prototype.scheduleLayout = function () {
            var _this = this;
            if (this._pendingLayout) {
                this._pendingLayout = false;
                window.clearTimeout(this._pendingLayoutTimeoutId);
            }
            this._pendingLayout = true;
            this._pendingLayoutTimeoutId = window.setTimeout(function () { _super.prototype.layout.call(_this); }, 100);
        };
        CallDurationTree.prototype.getDebugEventLinkWidth = function () {
            if (this._debugEventLinkWidth === -1) {
                var measurementContainer = this.createElementWithClass("div");
                measurementContainer.style.position = "absolute";
                measurementContainer.style.left = "-5000px";
                measurementContainer.style.top = "-5000px";
                measurementContainer.style.width = "1000px";
                measurementContainer.style.height = "500px";
                document.body.appendChild(measurementContainer);
                // Create the row and cell
                var linkElement = this.createDebugEventLinkElement(-1);
                measurementContainer.appendChild(linkElement);
                this._debugEventLinkWidth = linkElement.offsetWidth + linkElement.offsetLeft;
                // Remove the hidden element
                document.body.removeChild(measurementContainer);
            }
            return this._debugEventLinkWidth;
        };
        CallDurationTree.prototype.getVisibleWidth = function () {
            var headerWidth = window.innerWidth - 8; // 8 is the padding/borders of all the parent element of grid header.
            return headerWidth;
        };
        CallDurationTree.prototype.adjustWidth = function (totalWidth, preAllocatedWidth) {
            this._frameNameColumn.width = totalWidth - preAllocatedWidth;
            this._frameNameColumn.width -= this.getMeasurements().scrollbarWidth; // grid-canvas scrollbar width.
            if (this._frameNameColumn.width < CallDurationTree.MinMethodNameColumnWidth) {
                this._frameNameColumn.width = CallDurationTree.MinMethodNameColumnWidth;
            }
            this._onColumnResizeEvent(this.getColumns());
        };
        CallDurationTree.prototype.getParameterGridWidth = function () {
            // this._frameNameColumn should be created and is not null.
            var parameterGridWidth = this._frameNameColumn.width + CallDurationTree.ParameterGridWidthAdjustment;
            return parameterGridWidth;
        };
        CallDurationTree.prototype.handleNestedGridControlHeightChanged = function (dataIndex) {
            var methodDetail = this._methodDetails[dataIndex];
            if (methodDetail) {
                this.adjustMethodDetailElementHeight(dataIndex);
                var rowIndex = this._getRowIndex(dataIndex);
                this.calcRowTops(rowIndex);
                methodDetail.isDirty = true;
            }
            this.scheduleLayout();
        };
        CallDurationTree.prototype.removeHyperlinkStyle = function (element) {
            if (element != null) {
                element.classList.remove(CallDurationTree.DottedBorder);
                element.classList.remove(CallDurationTree.BorderPlaceHolderClass);
                element.classList.remove(CallDurationTree.SelectedLinkClass);
                element.classList.remove(CallDurationTree.MouseOverLinkClass);
                element.classList.remove(CallDurationTree.NonSelectedLinkClass);
            }
        };
        CallDurationTree.prototype.addHyperlinkStyle = function (element, isActive, isSelected, isHover) {
            if (element == null) {
                return;
            }
            if (isSelected) {
                if (isActive) {
                    element.classList.add(CallDurationTree.DottedBorder);
                    element.classList.add(CallDurationTree.SelectedLinkClass);
                }
                else {
                    element.classList.add(CallDurationTree.BorderPlaceHolderClass);
                    element.classList.add(CallDurationTree.SelectedLinkClass);
                }
            }
            else if (isHover) {
                element.classList.add(CallDurationTree.BorderPlaceHolderClass);
                element.classList.add(CallDurationTree.MouseOverLinkClass);
            }
            else {
                element.classList.add(CallDurationTree.BorderPlaceHolderClass);
                element.classList.add(CallDurationTree.NonSelectedLinkClass);
            }
        };
        CallDurationTree.prototype.isInHotPath = function (dataIndex, descendentCount) {
            return ((dataIndex < this._selectedSlowestNodeDataIndex) && (descendentCount + dataIndex >= this._selectedSlowestNodeDataIndex));
        };
        CallDurationTree.prototype.addMouseHoverOnRow = function (rowInfo) {
            var row = rowInfo.row;
            if (row != null) {
                var shownElement = this.showDebugLinkOnRow(row);
                this.addHyperlinkStyle(shownElement, this.isActive(), false, true);
                shownElement.parentNode.classList.add(CallDurationTree.RowHoverClass);
                var cellElement = CallDurationTree.getFirstElementByClassName(row, CallDurationTree.DurationCellSelectionClass);
                if (cellElement != null) {
                    var highlight = _super.prototype.getColumnValue.call(this, rowInfo.dataIndex, IntelliTrace.StackFrameDataFields.Highlight, null);
                    if (highlight) {
                        //If a row is highlighted, we should still color it red
                        cellElement.classList.add(CallDurationTree.HighlightHoverClass);
                    }
                    else {
                        cellElement.classList.add(CallDurationTree.RowHoverClass);
                    }
                }
            }
        };
        CallDurationTree.prototype.removeMouseHoverOnHoveredRow = function () {
            if (this._dataIndexOfHoveredRow !== CallDurationTree.InvalidDataIndexForSelection) {
                if (this._dataIndexOfHoveredRow !== this.getSelectedDataIndex()) {
                    this.removeMouseHoverAtDataIndex(this._dataIndexOfHoveredRow);
                }
                this._dataIndexOfHoveredRow = CallDurationTree.InvalidDataIndexForSelection;
            }
        };
        CallDurationTree.prototype.removeMouseHoverAtDataIndex = function (dataIndex) {
            var rowInfo = this.getRowInfo(dataIndex);
            if (rowInfo != null) {
                this.removeMouseHoverOnRow(rowInfo);
            }
        };
        CallDurationTree.prototype.removeMouseHoverOnRow = function (rowInfo) {
            var row = rowInfo.row;
            if (row != null) {
                var hiddenElement = this.hideDebugLinkOnRow(rowInfo.row);
                this.removeHyperlinkStyle(hiddenElement);
                hiddenElement.parentNode.classList.remove(CallDurationTree.RowHoverClass);
                var cellElement = CallDurationTree.getFirstElementByClassName(row, CallDurationTree.DurationCellSelectionClass);
                if (cellElement != null) {
                    cellElement.classList.remove(CallDurationTree.RowHoverClass);
                    cellElement.classList.remove(CallDurationTree.HighlightHoverClass);
                }
            }
        };
        CallDurationTree.prototype.hideDebugLinkAtDataIndex = function (dataIndex) {
            var row = this.getRowElementAt(dataIndex);
            if (row != null) {
                return this.hideDebugLinkOnRow(row);
            }
            return null;
        };
        CallDurationTree.prototype.hideDebugLinkOnRow = function (row) {
            var debugLinkElement = CallDurationTree.getFirstElementByClassName(row, CallDurationTree.DebugLinkSelectionClass);
            if (debugLinkElement != null) {
                debugLinkElement.classList.remove(CallDurationTree.VisibleElementClass);
                debugLinkElement.classList.add(CallDurationTree.InvisibleElementClass);
                var maxDescriptionTextElementWidth = this.calculateDescriptionTextElementMaxWidth(row, false);
                this.setDescriptionTextElementMaxWidth(row, maxDescriptionTextElementWidth);
            }
            return debugLinkElement;
        };
        CallDurationTree.prototype.showDebugLinkAtDataIndex = function (dataIndex) {
            var row = this.getRowElementAt(dataIndex);
            if (row != null) {
                return this.showDebugLinkOnRow(row);
            }
            return null;
        };
        CallDurationTree.prototype.showDebugLinkOnRow = function (row) {
            var debugLinkElement = CallDurationTree.getFirstElementByClassName(row, CallDurationTree.DebugLinkSelectionClass);
            if (debugLinkElement != null) {
                debugLinkElement.classList.remove(CallDurationTree.InvisibleElementClass);
                debugLinkElement.classList.add(CallDurationTree.VisibleElementClass);
                var maxDescriptionTextElementWidth = this.calculateDescriptionTextElementMaxWidth(row, true);
                this.setDescriptionTextElementMaxWidth(row, maxDescriptionTextElementWidth);
            }
            return debugLinkElement;
        };
        CallDurationTree.prototype.calculateDescriptionTextElementMaxWidth = function (row, hasDebugLink) {
            var maxDescriptionTextElementWidth = this._frameNameColumn.width;
            if (this.hasMethodDetailExpandIconOnRow(row)) {
                maxDescriptionTextElementWidth -= IntelliTrace.CustomGridControl.IconWidth;
            }
            if (hasDebugLink) {
                maxDescriptionTextElementWidth -= this.getDebugEventLinkWidth() + this._debugEventLinkWidthAdjustment;
            }
            return maxDescriptionTextElementWidth;
        };
        CallDurationTree.prototype.setDescriptionTextElementMaxWidth = function (row, maxWidth) {
            var textElement = CallDurationTree.getFirstElementByClassName(row, CallDurationTree.DescriptionTextElementSelectionClass);
            if (textElement != null) {
                textElement.style.maxWidth = String(maxWidth) + "px";
                textElement.removeAttribute(IntelliTrace.CustomGridControl.TooltipAttribute);
                this.addTooltipWhenObscured(textElement);
            }
        };
        CallDurationTree.prototype.hasMethodDetailExpandIconOnRow = function (row) {
            var treeIcon = CallDurationTree.getFirstElementByClassName(row, CallDurationTree.MethodDetailExpandIconClass);
            return treeIcon != null;
        };
        CallDurationTree.prototype.getRowElementAt = function (dataIndex) {
            if (!this.isValidDataIndex(dataIndex)) {
                return null;
            }
            var rowInfo = this.getRowInfo(dataIndex);
            if (rowInfo != null) {
                return rowInfo.row;
            }
            return null;
        };
        CallDurationTree.getFirstElementByClassName = function (parentElement, className) {
            var childrenNode = parentElement.getElementsByClassName(className);
            if (childrenNode != null && childrenNode.length > 0) {
                return childrenNode[0];
            }
            return null;
        };
        CallDurationTree.prototype.isValidDataIndex = function (dataIndex) {
            var expandState = this.getExpandStates();
            if (expandState != null) {
                return (dataIndex >= 0) && (dataIndex < expandState.length);
            }
            return false;
        };
        CallDurationTree.prototype.isSelectedGridHandleFocus = function () {
            return (this.selectedNestedGrid != null) && (this.selectedNestedGrid.isSelectedFromParent);
        };
        CallDurationTree.prototype.getFrameNameHeight = function (dataIndex) {
            // use data index to initialize members
            if (dataIndex < 0 || dataIndex >= this.getExpandStates().length) {
                return 0;
            }
            if (this._frameNameHeight[dataIndex] == null) {
                var rowViewModel = this.getRowData(dataIndex);
                var description = rowViewModel[IntelliTrace.StackFrameDataFields.Description];
                // initialize frame name height 
                if ((description && description !== "")) {
                    this._frameNameHeight[dataIndex] = this.getMultilineTextHeight(description);
                }
                else {
                    this._frameNameHeight[dataIndex] = this.getMultilineTextHeight(rowViewModel[IntelliTrace.StackFrameDataFields.Signature]);
                }
            }
            return this._frameNameHeight[dataIndex];
        };
        ///
        /// End Private Helpers
        ///
        /// Expose members for testing purpose
        CallDurationTree.prototype.getMethodDetails = function () {
            return this._methodDetails;
        };
        CallDurationTree.RowBorderHeight = 2;
        CallDurationTree.DefaultTotalTimeColumnWidth = 150;
        CallDurationTree.MinTotalTimeColumnWidth = 75;
        CallDurationTree.MaxTotalTimeColumnWidth = 600;
        CallDurationTree.DefaultMethodNameColumnWidth = 800;
        CallDurationTree.MinMethodNameColumnWidth = 400;
        CallDurationTree.ParameterGridWidthAdjustment = -3;
        CallDurationTree.HighlightCellClass = "highlighted-cell";
        CallDurationTree.HighlightTextClass = "highlight-duration-text";
        CallDurationTree.HighlightTextClassSelected = "highlight-duration-text-selected";
        CallDurationTree.HighlightHoverClass = "highlight-hover";
        CallDurationTree.BorderPlaceHolderClass = "border-placeholder";
        CallDurationTree.DebugLinkSelectionClass = "debug-link-for-selection";
        CallDurationTree.DescriptionTextElementSelectionClass = "description-text-element-for-selection";
        CallDurationTree.SignatureElementSelectionClass = "signature-element-for-selection";
        CallDurationTree.DurationCellSelectionClass = "duration-cell-for-selection";
        CallDurationTree.InvisibleElementClass = "invisible-element";
        CallDurationTree.VisibleElementClass = "visible-element";
        CallDurationTree.MethodDetailExpandIconClass = "method-detail-expand-icon";
        CallDurationTree.RowHoverClass = "row-hover";
        CallDurationTree.DottedBorder = "dotted-border";
        CallDurationTree.SelectedLinkClass = "calltree-hyperlink-selected";
        CallDurationTree.MouseOverLinkClass = "calltree-hyperlink";
        CallDurationTree.NonSelectedLinkClass = "hyperlink";
        CallDurationTree.InvalidDataIndexForSelection = -1;
        return CallDurationTree;
    }(IntelliTrace.CustomGridControl));
    IntelliTrace.CallDurationTree = CallDurationTree;
})(IntelliTrace || (IntelliTrace = {}));
// 
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="ExternalReferences.ts" />
/// <reference path="CallDurationTree.ts" />
//--- alert("debug me");
var IntelliTrace;
(function (IntelliTrace) {
    var CallDurationView = (function () {
        function CallDurationView() {
            var _this = this;
            this._callDurationView = document.getElementById("callDurationView");
            this._callDurationView.className = "callDurationView";
            // Initialize the call duration tree
            this._callDurationTree = document.createElement("div");
            this._callDurationTree.className = "callDurationTree";
            this._callDurationTree.setAttribute("aria-label", ""); // clear the value otherwise the whole grid text will be used.
            var adapter = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.VisualStudio.TraceLogPackage.SummaryPage.CallDurationViewModelMarshaler", {}, true);
            this._gridControl = new IntelliTrace.CallDurationTree(adapter, this._callDurationTree);
            this._gridControl.init(function () {
                _this.initExpandAllButton();
                _this._callDurationTree.setAttribute("tabindex", "-1");
                _this._callDurationView.appendChild(_this._callDurationTree);
            });
        }
        CallDurationView.prototype.initExpandAllButton = function () {
            var _this = this;
            var expandStatus = this._gridControl.getExpandStates();
            if (!expandStatus.every(function (value, index, array) { return (value === 0); })) {
                // Only add the expand all button when there is expandable/collapsable item
                this._expandAllButton = document.createElement("a");
                this._expandAllButton.className = "expand-all-text hyperlink";
                this._expandAllButton.id = CallDurationView.idExpandCollapseAll;
                this._expandAllButton.setAttribute("tabindex", "0");
                this._callDurationView.appendChild(this._expandAllButton);
                if (expandStatus.every(function (value, index, array) { return (value >= 0); })) {
                    this.setupExpandAllButton(false);
                }
                else {
                    this.setupExpandAllButton(true);
                }
                // May need to switch between "expand all" and "collapse all" when user manually expand or collapse
                this._callDurationTree.addEventListener(Common.Controls.Grid.GridControl.EVENT_ROW_EXPANDED_COLLAPSED, function (e) {
                    if (e && e.customData && e.customData.length > 0) {
                        var isExpanded = e.customData[0].isExpanded;
                        if (isExpanded && _this._isShowingExpandAll && expandStatus.every(function (value, index, array) { return (value >= 0); })) {
                            // everything is expanded, show collapse all
                            _this.setupExpandAllButton(false);
                        }
                        else if (!isExpanded && !_this._isShowingExpandAll) {
                            // something is expandable, show expand all
                            _this.setupExpandAllButton(true);
                        }
                    }
                });
            }
            else {
                // Remove the space for expand all button
                this._callDurationTree.style.paddingTop = "0px";
            }
        };
        // The button will show "Expand All" if expandAll parameter is true, otherwise it will show "Collapse All".
        CallDurationView.prototype.setupExpandAllButton = function (expandAll) {
            var _this = this;
            var linkElement = document.getElementById(CallDurationView.idExpandCollapseAll);
            // clear the old event listener
            if (this._expandAllEventListener) {
                linkElement.removeEventListener("click", this._expandAllEventListener);
                linkElement.removeEventListener("keydown", this._expandAllKeyDownEventListener);
            }
            var text = Microsoft.Plugin.Resources.getString(expandAll ? "ExpandAllButtonText" : "CollapseAllButtonText");
            linkElement.innerText = text;
            linkElement.setAttribute("aria-label", text);
            this._isShowingExpandAll = expandAll;
            if (expandAll) {
                this._expandAllEventListener = function () {
                    _this._gridControl.expandAll();
                };
                this._expandAllKeyDownEventListener = function (e) {
                    if (e.keyCode == Common.KeyCodes.ENTER) {
                        _this._gridControl.expandAll();
                    }
                };
            }
            else {
                this._expandAllEventListener = function () {
                    _this._gridControl.collapseAll();
                };
                this._expandAllKeyDownEventListener = function (e) {
                    if (e.keyCode == Common.KeyCodes.ENTER) {
                        _this._gridControl.collapseAll();
                    }
                };
            }
            linkElement.addEventListener("click", this._expandAllEventListener);
            linkElement.addEventListener("keydown", this._expandAllKeyDownEventListener);
        };
        CallDurationView.idExpandCollapseAll = "expandCollapseAll";
        return CallDurationView;
    }());
    //==========================================================================================================================================================
    // Register the GUI
    Microsoft.Plugin.addEventListener("pluginready", function () {
        CallDurationView.s_instance = new CallDurationView();
    });
})(IntelliTrace || (IntelliTrace = {}));

// SIG // Begin signature block
// SIG // MIIkWAYJKoZIhvcNAQcCoIIkSTCCJEUCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // kcQqqJTbCmA1Ndq0FXv2Wm5I8tGynnjZUGguL8v5xn+g
// SIG // gg2BMIIF/zCCA+egAwIBAgITMwAAAQNeJRyZH6MeuAAA
// SIG // AAABAzANBgkqhkiG9w0BAQsFADB+MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBT
// SIG // aWduaW5nIFBDQSAyMDExMB4XDTE4MDcxMjIwMDg0OFoX
// SIG // DTE5MDcyNjIwMDg0OFowdDELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjEeMBwGA1UEAxMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
// SIG // 0ZR2NuaGqzb+aflGfIuIUMuQcH+wVakkHX455wWfD6x7
// SIG // l7LOcwr71JskXBa1Od0bfjNsEfw7JvOYql1Ta6rD7BO4
// SIG // 0u/PV3/MZcuvTS4ysVYrTjQHif5pIb0+RPveEp2Fv3x2
// SIG // hn1ysXabYeaKZExGzrbVOox3k3dnIZy2WgZeR4b1PNEJ
// SIG // yg09zbLpoVB40YSI4gE8IvyvlgjMXZnA7eulWpiS9chA
// SIG // Tmpzr97jdHrTX0aXvOJnKHeZrMEOMRaPAA8B/kteVA/K
// SIG // xGU/CuOjRtv2LAM6Gb5oBRac5n80v6eHjWU5Jslj1O/F
// SIG // 3b0l/v0o9DSGeawq1V8wkTvkFGrrscoEIwIDAQABo4IB
// SIG // fjCCAXowHwYDVR0lBBgwFgYKKwYBBAGCN0wIAQYIKwYB
// SIG // BQUHAwMwHQYDVR0OBBYEFEe+wMvhpj/9ZdY48gNdt693
// SIG // 90D/MFAGA1UdEQRJMEekRTBDMSkwJwYDVQQLEyBNaWNy
// SIG // b3NvZnQgT3BlcmF0aW9ucyBQdWVydG8gUmljbzEWMBQG
// SIG // A1UEBRMNMjMwMDEyKzQzNzk2NTAfBgNVHSMEGDAWgBRI
// SIG // bmTlUAXTgqoXNzcitW2oynUClTBUBgNVHR8ETTBLMEmg
// SIG // R6BFhkNodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtp
// SIG // b3BzL2NybC9NaWNDb2RTaWdQQ0EyMDExXzIwMTEtMDct
// SIG // MDguY3JsMGEGCCsGAQUFBwEBBFUwUzBRBggrBgEFBQcw
// SIG // AoZFaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3BraW9w
// SIG // cy9jZXJ0cy9NaWNDb2RTaWdQQ0EyMDExXzIwMTEtMDct
// SIG // MDguY3J0MAwGA1UdEwEB/wQCMAAwDQYJKoZIhvcNAQEL
// SIG // BQADggIBAJ/1yVMNPw0m7KJE2A3Rn2OWBks/HlzFM6Ok
// SIG // w2yvH8ABuutl7J4zEA+nrFvUvZBhF+cx58MmtKz1J9NI
// SIG // k4aI/hI1kWQi0WstO6gsFZQp0jeW5jX/DM7IBhYWniSx
// SIG // 4jn5bg542AwbtilgJ3Y0JJvduZd1ywE7rYISFiKAiRWE
// SIG // u5hQILAXJoZJr859RRVDNJbPgVwYLNST8mer4nPIPaPN
// SIG // /DIeYBzpsBsw+yy7By6WhJNFKFRczZb9oNuB2LYwykOx
// SIG // 80jAskYcXV52Klif1O7y9PpITLVhi7CMQemquJ2Q9P9q
// SIG // Qg+5PukO7JT8jYC7eOMjp3hbsm0f+VnBfbbROcl54IMc
// SIG // YAraPbDR7Ta/RQfpGzZu5T07BQOn1KclEo/mdqMTs0Va
// SIG // QzGC2tiErrmwH3X19h19URE3J+i1NYRx91eqrvqJccmY
// SIG // 0p5aZHa+jMN9FWqR8RT08tk1Mbjbcvq0dciIm2q/mEXH
// SIG // ZrLX/86SkHXk6+aG0sgb2yfAW5VvSW9YXWkq3lNL+OjK
// SIG // e/ZsFfkDGQ8RhapPmr+qV91gxvVxIPRRqJrK6dHrNEc9
// SIG // dfoi7FU/ahk5axDpWj+O9CN4MLLypjjLNY2qmFkkQLg6
// SIG // Z6QHX6D+2DtJE/sM4e0LbYNQzvB/PuDZCOiMIUpBwt7r
// SIG // jlvuA8Mdbm7mVDVmZ3J8GupS9iLEcj+uMIIHejCCBWKg
// SIG // AwIBAgIKYQ6Q0gAAAAAAAzANBgkqhkiG9w0BAQsFADCB
// SIG // iDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEyMDAGA1UEAxMpTWlj
// SIG // cm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5
// SIG // IDIwMTEwHhcNMTEwNzA4MjA1OTA5WhcNMjYwNzA4MjEw
// SIG // OTA5WjB+MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
// SIG // aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UE
// SIG // ChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSgwJgYDVQQD
// SIG // Ex9NaWNyb3NvZnQgQ29kZSBTaWduaW5nIFBDQSAyMDEx
// SIG // MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA
// SIG // q/D6chAcLq3YbqqCEE00uvK2WCGfQhsqa+laUKq4Bjga
// SIG // BEm6f8MMHt03a8YS2AvwOMKZBrDIOdUBFDFC04kNeWSH
// SIG // fpRgJGyvnkmc6Whe0t+bU7IKLMOv2akrrnoJr9eWWcpg
// SIG // GgXpZnboMlImEi/nqwhQz7NEt13YxC4Ddato88tt8zpc
// SIG // oRb0RrrgOGSsbmQ1eKagYw8t00CT+OPeBw3VXHmlSSnn
// SIG // Db6gE3e+lD3v++MrWhAfTVYoonpy4BI6t0le2O3tQ5GD
// SIG // 2Xuye4Yb2T6xjF3oiU+EGvKhL1nkkDstrjNYxbc+/jLT
// SIG // swM9sbKvkjh+0p2ALPVOVpEhNSXDOW5kf1O6nA+tGSOE
// SIG // y/S6A4aN91/w0FK/jJSHvMAhdCVfGCi2zCcoOCWYOUo2
// SIG // z3yxkq4cI6epZuxhH2rhKEmdX4jiJV3TIUs+UsS1Vz8k
// SIG // A/DRelsv1SPjcF0PUUZ3s/gA4bysAoJf28AVs70b1FVL
// SIG // 5zmhD+kjSbwYuER8ReTBw3J64HLnJN+/RpnF78IcV9uD
// SIG // jexNSTCnq47f7Fufr/zdsGbiwZeBe+3W7UvnSSmnEyim
// SIG // p31ngOaKYnhfsi+E11ecXL93KCjx7W3DKI8sj0A3T8Hh
// SIG // hUSJxAlMxdSlQy90lfdu+HggWCwTXWCVmj5PM4TasIgX
// SIG // 3p5O9JawvEagbJjS4NaIjAsCAwEAAaOCAe0wggHpMBAG
// SIG // CSsGAQQBgjcVAQQDAgEAMB0GA1UdDgQWBBRIbmTlUAXT
// SIG // gqoXNzcitW2oynUClTAZBgkrBgEEAYI3FAIEDB4KAFMA
// SIG // dQBiAEMAQTALBgNVHQ8EBAMCAYYwDwYDVR0TAQH/BAUw
// SIG // AwEB/zAfBgNVHSMEGDAWgBRyLToCMZBDuRQFTuHqp8cx
// SIG // 0SOJNDBaBgNVHR8EUzBRME+gTaBLhklodHRwOi8vY3Js
// SIG // Lm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9N
// SIG // aWNSb29DZXJBdXQyMDExXzIwMTFfMDNfMjIuY3JsMF4G
// SIG // CCsGAQUFBwEBBFIwUDBOBggrBgEFBQcwAoZCaHR0cDov
// SIG // L3d3dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNS
// SIG // b29DZXJBdXQyMDExXzIwMTFfMDNfMjIuY3J0MIGfBgNV
// SIG // HSAEgZcwgZQwgZEGCSsGAQQBgjcuAzCBgzA/BggrBgEF
// SIG // BQcCARYzaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3Br
// SIG // aW9wcy9kb2NzL3ByaW1hcnljcHMuaHRtMEAGCCsGAQUF
// SIG // BwICMDQeMiAdAEwAZQBnAGEAbABfAHAAbwBsAGkAYwB5
// SIG // AF8AcwB0AGEAdABlAG0AZQBuAHQALiAdMA0GCSqGSIb3
// SIG // DQEBCwUAA4ICAQBn8oalmOBUeRou09h0ZyKbC5YR4WOS
// SIG // mUKWfdJ5DJDBZV8uLD74w3LRbYP+vj/oCso7v0epo/Np
// SIG // 22O/IjWll11lhJB9i0ZQVdgMknzSGksc8zxCi1LQsP1r
// SIG // 4z4HLimb5j0bpdS1HXeUOeLpZMlEPXh6I/MTfaaQdION
// SIG // 9MsmAkYqwooQu6SpBQyb7Wj6aC6VoCo/KmtYSWMfCWlu
// SIG // WpiW5IP0wI/zRive/DvQvTXvbiWu5a8n7dDd8w6vmSiX
// SIG // mE0OPQvyCInWH8MyGOLwxS3OW560STkKxgrCxq2u5bLZ
// SIG // 2xWIUUVYODJxJxp/sfQn+N4sOiBpmLJZiWhub6e3dMNA
// SIG // BQamASooPoI/E01mC8CzTfXhj38cbxV9Rad25UAqZaPD
// SIG // XVJihsMdYzaXht/a8/jyFqGaJ+HNpZfQ7l1jQeNbB5yH
// SIG // PgZ3BtEGsXUfFL5hYbXw3MYbBL7fQccOKO7eZS/sl/ah
// SIG // XJbYANahRr1Z85elCUtIEJmAH9AAKcWxm6U/RXceNcbS
// SIG // oqKfenoi+kiVH6v7RyOA9Z74v2u3S5fi63V4GuzqN5l5
// SIG // GEv/1rMjaHXmr/r8i+sLgOppO6/8MO0ETI7f33VtY5E9
// SIG // 0Z1WTk+/gFcioXgRMiF670EKsT/7qMykXcGhiJtXcVZO
// SIG // SEXAQsmbdlsKgEhr/Xmfwb1tbWrJUnMTDXpQzTGCFi8w
// SIG // ghYrAgEBMIGVMH4xCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKDAm
// SIG // BgNVBAMTH01pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENB
// SIG // IDIwMTECEzMAAAEDXiUcmR+jHrgAAAAAAQMwDQYJYIZI
// SIG // AWUDBAIBBQCgga4wGQYJKoZIhvcNAQkDMQwGCisGAQQB
// SIG // gjcCAQQwHAYKKwYBBAGCNwIBCzEOMAwGCisGAQQBgjcC
// SIG // ARUwLwYJKoZIhvcNAQkEMSIEILVgUwJ75cdL6iscFu3L
// SIG // 8QKyPiWRxm0utfPC1dhAzszWMEIGCisGAQQBgjcCAQwx
// SIG // NDAyoBSAEgBNAGkAYwByAG8AcwBvAGYAdKEagBhodHRw
// SIG // Oi8vd3d3Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEB
// SIG // BQAEggEApTHVuXixi+clhR0XOOBJNzINTtyQsJjpih2a
// SIG // yHldDZcrHgKChNub5VooXQfhmvNRUEtATeoM4itGtMFJ
// SIG // F4nQuDZtH4u/yLfJxy/wLDRRhEChxuUCu74KH6TqhVB7
// SIG // u4OW0oEkxHou305J8q/NEpSRCGGr74b93QOdDxTFFRde
// SIG // MmAJqJY63kDhonpKKvPaM9s2Yx/iw4AAYZV8hv2rDDs2
// SIG // zETXCDXYq7JyGsgOrTHogZw4ISPLmu0Ky0RQO8ciJNAJ
// SIG // AWiR4eNwCkgIGkjw0U2JD8+m9aWiZwjitL7RV0ofGNUj
// SIG // sEP2uSrd3QOft9PT+h5Txv0NYmIimjMCA1WoA+Asq6GC
// SIG // E7kwghO1BgorBgEEAYI3AwMBMYITpTCCE6EGCSqGSIb3
// SIG // DQEHAqCCE5IwghOOAgEDMQ8wDQYJYIZIAWUDBAIBBQAw
// SIG // ggFXBgsqhkiG9w0BCRABBKCCAUYEggFCMIIBPgIBAQYK
// SIG // KwYBBAGEWQoDATAxMA0GCWCGSAFlAwQCAQUABCAqeQ3X
// SIG // 5wE9l96GlpNmdK5XHw5wuwSadmNBaMGFXWuSLgIGW60E
// SIG // Oeh+GBIyMDE4MTAwODIxMDM0Ni43OVowBwIBAYACAfSg
// SIG // gdSkgdEwgc4xCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpX
// SIG // YXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
// SIG // VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKTAnBgNV
// SIG // BAsTIE1pY3Jvc29mdCBPcGVyYXRpb25zIFB1ZXJ0byBS
// SIG // aWNvMSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVTTjo1ODQ3
// SIG // LUY3NjEtNEY3MDElMCMGA1UEAxMcTWljcm9zb2Z0IFRp
// SIG // bWUtU3RhbXAgU2VydmljZaCCDyIwggT1MIID3aADAgEC
// SIG // AhMzAAAA1E8Zw9iEy0VjAAAAAADUMA0GCSqGSIb3DQEB
// SIG // CwUAMHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
// SIG // aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQK
// SIG // ExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMT
// SIG // HU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwMB4X
// SIG // DTE4MDgyMzIwMjY0MFoXDTE5MTEyMzIwMjY0MFowgc4x
// SIG // CzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9u
// SIG // MRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNy
// SIG // b3NvZnQgQ29ycG9yYXRpb24xKTAnBgNVBAsTIE1pY3Jv
// SIG // c29mdCBPcGVyYXRpb25zIFB1ZXJ0byBSaWNvMSYwJAYD
// SIG // VQQLEx1UaGFsZXMgVFNTIEVTTjo1ODQ3LUY3NjEtNEY3
// SIG // MDElMCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAg
// SIG // U2VydmljZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCC
// SIG // AQoCggEBAL9Iu7DEE7U++DhqaLlgE302Plp5lnp4UMi/
// SIG // aSQBSv2uy2Thd9hZoH9NIIpsIyXJImGO9hQUMdFKg292
// SIG // k7LrKKZb+O1Q39u/9JJQxePRCfIASMIRFi2Ex7RTUYPf
// SIG // DOcDk81Sn7oY1lytZ8z7Fuf0MejRqEI3yg4T4zBLEaRM
// SIG // 2Dx/L9Hn++NjEr60SOMnTbMEWUV9JnHa8doURZiEaCru
// SIG // JuI2nch8ZMHWAVhOJgOFdb2X0tDMRR3I2wj2ltVH7h8O
// SIG // DZ2x7A8Eb/C9EDhErqcG0AO8JXnQNF4/n0HIT2+vT9JZ
// SIG // Ne3skRip3lIAfnxwC9CTW2PqqjLsBodUdFHWt8kBGyUC
// SIG // AwEAAaOCARswggEXMB0GA1UdDgQWBBT+ZP+/xM5lNrjW
// SIG // prjSW0oVYJSXBzAfBgNVHSMEGDAWgBTVYzpcijGQ80N7
// SIG // fEYbxTNoWoVtVTBWBgNVHR8ETzBNMEugSaBHhkVodHRw
// SIG // Oi8vY3JsLm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9k
// SIG // dWN0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0wMS5jcmww
// SIG // WgYIKwYBBQUHAQEETjBMMEoGCCsGAQUFBzAChj5odHRw
// SIG // Oi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpL2NlcnRzL01p
// SIG // Y1RpbVN0YVBDQV8yMDEwLTA3LTAxLmNydDAMBgNVHRMB
// SIG // Af8EAjAAMBMGA1UdJQQMMAoGCCsGAQUFBwMIMA0GCSqG
// SIG // SIb3DQEBCwUAA4IBAQBJyOQSiX/GJS6nzqNMXlAPHZMy
// SIG // mFlFKRda6E7QR+X5r7Fy7FUMfOCE/FirwHKlNv9nZ6zD
// SIG // /2Bbc96kq7nDT2VyHY4RDljBPRCx6wShFsx0Zn5vw2bq
// SIG // qKxD50H2jW6D12ybsn8VnOrSZ94dfGncIkyVuwCHXhn9
// SIG // nvg9b9qnoTnKwLTgtpfqzUcwlC0bykYE0uqO+4HlRuFf
// SIG // e8iysSzBeWXSPPYzfqvvBByLCAfoILXlGABjl/ll2cUe
// SIG // PyG/6HZN83vQA9hUfl9VpRdRMzK4PUFJuALM5pJXecIk
// SIG // fRwm5+44uRLAAPB+iK6fHLB60Zl1Jdlnlb8rF8TY2pD9
// SIG // t3IELxJ/MIIGcTCCBFmgAwIBAgIKYQmBKgAAAAAAAjAN
// SIG // BgkqhkiG9w0BAQsFADCBiDELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjEyMDAGA1UEAxMpTWljcm9zb2Z0IFJvb3QgQ2VydGlm
// SIG // aWNhdGUgQXV0aG9yaXR5IDIwMTAwHhcNMTAwNzAxMjEz
// SIG // NjU1WhcNMjUwNzAxMjE0NjU1WjB8MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBQQ0EgMjAxMDCCASIwDQYJKoZIhvcNAQEBBQAD
// SIG // ggEPADCCAQoCggEBAKkdDbx3EYo6IOz8E5f1+n9plGt0
// SIG // VBDVpQoAgoX77XxoSyxfxcPlYcJ2tz5mK1vwFVMnBDEf
// SIG // QRsalR3OCROOfGEwWbEwRA/xYIiEVEMM1024OAizQt2T
// SIG // rNZzMFcmgqNFDdDq9UeBzb8kYDJYYEbyWEeGMoQedGFn
// SIG // kV+BVLHPk0ySwcSmXdFhE24oxhr5hoC732H8RsEnHSRn
// SIG // EnIaIYqvS2SJUGKxXf13Hz3wV3WsvYpCTUBR0Q+cBj5n
// SIG // f/VmwAOWRH7v0Ev9buWayrGo8noqCjHw2k4GkbaICDXo
// SIG // eByw6ZnNPOcvRLqn9NxkvaQBwSAJk3jN/LzAyURdXhac
// SIG // AQVPIk0CAwEAAaOCAeYwggHiMBAGCSsGAQQBgjcVAQQD
// SIG // AgEAMB0GA1UdDgQWBBTVYzpcijGQ80N7fEYbxTNoWoVt
// SIG // VTAZBgkrBgEEAYI3FAIEDB4KAFMAdQBiAEMAQTALBgNV
// SIG // HQ8EBAMCAYYwDwYDVR0TAQH/BAUwAwEB/zAfBgNVHSME
// SIG // GDAWgBTV9lbLj+iiXGJo0T2UkFvXzpoYxDBWBgNVHR8E
// SIG // TzBNMEugSaBHhkVodHRwOi8vY3JsLm1pY3Jvc29mdC5j
// SIG // b20vcGtpL2NybC9wcm9kdWN0cy9NaWNSb29DZXJBdXRf
// SIG // MjAxMC0wNi0yMy5jcmwwWgYIKwYBBQUHAQEETjBMMEoG
// SIG // CCsGAQUFBzAChj5odHRwOi8vd3d3Lm1pY3Jvc29mdC5j
// SIG // b20vcGtpL2NlcnRzL01pY1Jvb0NlckF1dF8yMDEwLTA2
// SIG // LTIzLmNydDCBoAYDVR0gAQH/BIGVMIGSMIGPBgkrBgEE
// SIG // AYI3LgMwgYEwPQYIKwYBBQUHAgEWMWh0dHA6Ly93d3cu
// SIG // bWljcm9zb2Z0LmNvbS9QS0kvZG9jcy9DUFMvZGVmYXVs
// SIG // dC5odG0wQAYIKwYBBQUHAgIwNB4yIB0ATABlAGcAYQBs
// SIG // AF8AUABvAGwAaQBjAHkAXwBTAHQAYQB0AGUAbQBlAG4A
// SIG // dAAuIB0wDQYJKoZIhvcNAQELBQADggIBAAfmiFEN4sbg
// SIG // mD+BcQM9naOhIW+z66bM9TG+zwXiqf76V20ZMLPCxWbJ
// SIG // at/15/B4vceoniXj+bzta1RXCCtRgkQS+7lTjMz0YBKK
// SIG // dsxAQEGb3FwX/1z5Xhc1mCRWS3TvQhDIr79/xn/yN31a
// SIG // PxzymXlKkVIArzgPF/UveYFl2am1a+THzvbKegBvSzBE
// SIG // JCI8z+0DpZaPWSm8tv0E4XCfMkon/VWvL/625Y4zu2Jf
// SIG // mttXQOnxzplmkIz/amJ/3cVKC5Em4jnsGUpxY517IW3D
// SIG // nKOiPPp/fZZqkHimbdLhnPkd/DjYlPTGpQqWhqS9nhqu
// SIG // BEKDuLWAmyI4ILUl5WTs9/S/fmNZJQ96LjlXdqJxqgaK
// SIG // D4kWumGnEcua2A5HmoDF0M2n0O99g/DhO3EJ3110mCII
// SIG // YdqwUB5vvfHhAN/nMQekkzr3ZUd46PioSKv33nJ+YWtv
// SIG // d6mBy6cJrDm77MbL2IK0cs0d9LiFAR6A+xuJKlQ5slva
// SIG // yA1VmXqHczsI5pgt6o3gMy4SKfXAL1QnIffIrE7aKLix
// SIG // qduWsqdCosnPGUFN4Ib5KpqjEWYw07t0MkvfY3v1mYov
// SIG // G8chr1m1rtxEPJdQcdeh0sVV42neV8HR3jDA/czmTfsN
// SIG // v11P6Z0eGTgvvM9YBS7vDaBQNdrvCScc1bN+NR4Iuto2
// SIG // 29Nfj950iEkSoYIDsDCCApgCAQEwgf6hgdSkgdEwgc4x
// SIG // CzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9u
// SIG // MRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNy
// SIG // b3NvZnQgQ29ycG9yYXRpb24xKTAnBgNVBAsTIE1pY3Jv
// SIG // c29mdCBPcGVyYXRpb25zIFB1ZXJ0byBSaWNvMSYwJAYD
// SIG // VQQLEx1UaGFsZXMgVFNTIEVTTjo1ODQ3LUY3NjEtNEY3
// SIG // MDElMCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAg
// SIG // U2VydmljZaIlCgEBMAkGBSsOAwIaBQADFQDtCAr/X+8c
// SIG // ZoDDwoyI+VwA3yqPQ6CB3jCB26SB2DCB1TELMAkGA1UE
// SIG // BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEpMCcGA1UECxMgTWljcm9zb2Z0IE9w
// SIG // ZXJhdGlvbnMgUHVlcnRvIFJpY28xJzAlBgNVBAsTHm5D
// SIG // aXBoZXIgTlRTIEVTTjo1N0Y2LUMxRTAtNTU0QzErMCkG
// SIG // A1UEAxMiTWljcm9zb2Z0IFRpbWUgU291cmNlIE1hc3Rl
// SIG // ciBDbG9jazANBgkqhkiG9w0BAQUFAAIFAN9mCvMwIhgP
// SIG // MjAxODEwMDkwMDU3MjNaGA8yMDE4MTAxMDAwNTcyM1ow
// SIG // dzA9BgorBgEEAYRZCgQBMS8wLTAKAgUA32YK8wIBADAK
// SIG // AgEAAgIlNgIB/zAHAgEAAgIX0TAKAgUA32dccwIBADA2
// SIG // BgorBgEEAYRZCgQCMSgwJjAMBgorBgEEAYRZCgMBoAow
// SIG // CAIBAAIDFuNgoQowCAIBAAIDB6EgMA0GCSqGSIb3DQEB
// SIG // BQUAA4IBAQAhwPmTzmLWYmh+iu6JdIlPkahsv9L95Z1j
// SIG // HKsLKX8R/sWmkCqEK+qYV5NvnuFqD7tWmlDS+yRBm1kO
// SIG // hI/b93Wm6HbiB259EbIHqEZV8psaXPkJkSashbSOynK+
// SIG // Zn5eDAXr7gFC7F2Y5eCMkMqrD94gCVLkfJEk9ZiHErX3
// SIG // j8Zw04nE4cUpyCy272+A2SBTa0GY/9GNq/J+Z+pVXdus
// SIG // Q1pULv717nigBW9tNOYn9Wxj77S0NmyxQgzfNg4rCNR7
// SIG // yuo00s5w9uHHSDfteWz+vzyECu5Rfn5yx8SuaPzAQU21
// SIG // hdI63NW4N67MYRdzuVtZJqZ57c8M69BJ4bX7wDXRQrxs
// SIG // MYIC9TCCAvECAQEwgZMwfDELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAg
// SIG // UENBIDIwMTACEzMAAADUTxnD2ITLRWMAAAAAANQwDQYJ
// SIG // YIZIAWUDBAIBBQCgggEyMBoGCSqGSIb3DQEJAzENBgsq
// SIG // hkiG9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQgr4KVsQJ0
// SIG // WXJnNT5NSluUoJQcAk6lN2PTs8X1f1gTK9MwgeIGCyqG
// SIG // SIb3DQEJEAIMMYHSMIHPMIHMMIGxBBTtCAr/X+8cZoDD
// SIG // woyI+VwA3yqPQzCBmDCBgKR+MHwxCzAJBgNVBAYTAlVT
// SIG // MRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdS
// SIG // ZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9y
// SIG // YXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0
// SIG // YW1wIFBDQSAyMDEwAhMzAAAA1E8Zw9iEy0VjAAAAAADU
// SIG // MBYEFNO7aXWG3NN+t5oDG6wYkTcHFRXGMA0GCSqGSIb3
// SIG // DQEBCwUABIIBAAwsehNyMeKhhCeU/cqpIZoCW1B5+n88
// SIG // zBmi5sAjQETHVCTUiBnP/ofltvvg/HLwoOh6ONfwyvel
// SIG // ppVm9BcqbqxaKkU1NoXU+3WNqyRFurV2SDfV1xo2gx2y
// SIG // TEC/l6CIAxGBS1lzSnF+gEXh1lyaDkKnqYfFqwOKdBWl
// SIG // ZR9wZCJjDNyn5kjJ3TIQ8KEgB+zJ+Zk9IfPOfsmuOlSc
// SIG // igkgJznjiHljipedgM6KlrXpsY+aKm2d8tOoCmL+rjAJ
// SIG // 4jOe15/wH+4ab3Lj6ZP6/a3yMAKDCctMJKTswr44kfpF
// SIG // KbEuXQ1iNFjXBQtd4Q7YiKSeGNQEGc9yrpQYsSj0XCME8xY=
// SIG // End signature block
