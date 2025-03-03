import { Button } from "@/components/ui/button";
import { projectHooks } from "@/hooks/project-hooks";
import { RefreshCw, Trash2 } from "lucide-react";
import { useTableState } from "./ap-table-state-provider";
import RowHeightToggle from "./row-height-toggle";
import { FiltersPopup } from "./filters-popup";
import { ConfirmationDeleteDialog } from "@/components/delete-dialog";
import { t } from "i18next";
import { tableHooks } from "../lib/ap-tables-hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useEmbedding } from "@/components/embed-provider";
import { HomeButton } from "@/components/ui/home-button";


const ApTableHeader = ({tableId, isFetchingNextPage}: {tableId: string, isFetchingNextPage: boolean}) => {

    const navigate = useNavigate();
    const {project} = projectHooks.useCurrentProject();
    const {embedState} = useEmbedding();
    const [isSaving, enqueueMutation, rowHeight, setRowHeight,selectedRows, setSelectedRows] = useTableState(state => [state.isSaving, state.enqueueMutation, state.rowHeight, state.setRowHeight, state.selectedRows, state.setSelectedRows]);
    const { data: tableData } =
    tableHooks.useFetchTable(tableId);

    const queryClient = useQueryClient();
    const location = useLocation();
    const { data: fieldsData } = tableHooks.useFetchFields(tableId);
    const deleteRecordsMutation = tableHooks.useDeleteRecords({
        location,
        tableId: tableId,
        onSuccess: () => {
            setSelectedRows(new Set());
        },
        queryClient: queryClient,
    });
    return ( <div className="flex flex-col gap-4 ml-3 pt-4 flex-none">
        <div className="flex items-center gap-4">
          <HomeButton route={'/tables'}/>
          <span className="text-xl">{tableData?.name}</span>

          {isSaving && (
            <div className="flex items-center gap-2 text-muted-foreground animate-fade-in">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm">{t('Saving...')}</span>
            </div>
          )}
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-muted-foreground animate-fade-in">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm">{t('Loading more...')}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {fieldsData && <FiltersPopup fields={fieldsData} />}
            <span className="text-sm text-muted-foreground ml-2">
              {t('Row Height')}
            </span>
            <RowHeightToggle
              rowHeight={rowHeight}
              setRowHeight={setRowHeight}
            />
          </div>
          <div className="flex items-center gap-2 mr-2">
            {selectedRows.size > 0 && (
              <div onClick={(e) => e.stopPropagation()}>
                <ConfirmationDeleteDialog
                  title={t('Delete Records')}
                  message={t(
                    'Are you sure you want to delete the selected records? This action cannot be undone.',
                  )}
                  entityName={
                    selectedRows.size === 1 ? t('record') : t('records')
                  }
                  mutationFn={async () => {
                    await enqueueMutation(
                      deleteRecordsMutation,
                      Array.from(selectedRows),
                    );
                    setSelectedRows(new Set());
                  }}
                >
                  <Button
                    className="w-full mr-2"
                    size="sm"
                    variant="destructive"
                    loading={false}
                  >
                    <Trash2 className="mr-2 w-4" />
                    {`${t('Delete')} (${selectedRows.size})`}
                  </Button>
                </ConfirmationDeleteDialog>
              </div>
            )}
          </div>
        </div>
      </div>)
}

ApTableHeader.displayName = '   ';

export default ApTableHeader;