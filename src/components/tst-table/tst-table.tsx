import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TstTableToolBar } from "./tst-table-toolbar";
import { ColumnHeaderComponent } from "./tst-table-column";

interface TstTableProps {
  data: any[];
  columns: ColumnDef<any>[];
  pageSize?: number;
  pageSizeSelector?: boolean;
  pagination?: boolean;
  viewSelector?: boolean;
  refetch?: () => void;
  customComponents?: any;
  csvData?: any[];
  printFunction?: () => void;
  disablePrint?: boolean;
  disableExport?: boolean;
  disableViewSelector?: boolean;
  disableSearch?: boolean;
}

const TstTable = (props: TstTableProps) => {
  const { t } = useTranslation();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [showFilter, setShowFilter] = React.useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data: props.data,
    columns: props.columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      columnFilters,
      globalFilter,
      sorting,
    },
  });

  const Pagination = () => {
    return (
      <>
        <div className="flex justify-center items-center gap-3">
          <Button
            variant="outline"
            className="p-3"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeft className="w-5 mr-2" />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button>
                {table.getState().pagination.pageIndex +
                  1 +
                  " - " +
                  table.getPageCount()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40">
              <Label htmlFor="page" className="text-center text-gray-500">
                {t("Pagina")}
              </Label>
              <Input
                id="page"
                type="number"
                min={1}
                max={table.getPageCount()}
                className="w-full"
                value={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  table.setPageIndex(Number(e.target.value) - 1);
                }}
              />
            </PopoverContent>
          </Popover>
          <Button
            className="p-3"
            variant="outline"
            disabled={!table.getCanNextPage()}
            onClick={() => {
              table.nextPage();
            }}
          >
            <ChevronRight className="w-5 mr-2" />
          </Button>
        </div>
      </>
    );
  };

  const PageSize = () => {
    return (
      <>
        <div className="flex items-center gap-3">
          <Select
            onValueChange={(e) => {
              table.setPageSize(Number(e));
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="40">40</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm">{t("Elementi per pagina")}</span>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="relative">
        <div className="p-5 relative">
          <div className="rounded-md border">
            <TstTableToolBar
              refetch={props.refetch}
              viewSelector={props.viewSelector}
              customComponents={props.customComponents}
              table={table}
              setGlobalFilter={setGlobalFilter}
              globalFilter={globalFilter}
              enableFilter={showFilter}
              setEnableFilter={setShowFilter}
              csvData={props.csvData}
              printFunction={props.printFunction}
              disablePrint={props.disablePrint}
              disableExport={props.disableExport}
              disableViewSelector
              disableSearch={props.disableSearch}
            />
            <Table>
              <TableHeader className="whitespace-nowrap">
                {table.getHeaderGroups().map((headerGroup, index) => (
                  <TableRow key={index}>
                    {headerGroup.headers.map((header, index) => {
                      return (
                        <TableHead key={index}>
                          <ColumnHeaderComponent
                            column={header.column}
                            sorrtingFunction={header.column.columnDef.sortingFn}
                            title={
                              header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )
                            }
                            showFilter={showFilter}
                            setShowFilter={setShowFilter}
                          />
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={index}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell, index) => (
                        <TableCell key={index}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={props.columns.length}
                      className="h-24 text-center"
                    >
                      {t("No results.")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="w-full flex justify-between p-3 border-t-[1px]">
              <div>{props.pageSizeSelector !== false && <PageSize />}</div>
              <div>{props.pagination !== false && <Pagination />}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TstTable;
