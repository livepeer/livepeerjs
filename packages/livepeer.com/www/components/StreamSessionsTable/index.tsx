import { useEffect, useState } from "react";
import { useApi, usePageVisibility } from "../../hooks";
import { Box, Button, IconButton, Flex } from "@theme-ui/components";
import { Table, TableRow, TableRowVariant } from "../Table";
import { Stream } from "@livepeer/api";
import { RelativeTime, RenditionsDetails } from "../StreamsTable";

export default ({
  streamId,
  mt = null
}: {
  streamId: string;
  mt?: string | number;
}) => {
  const [streamsSessions, setStreamsSessions] = useState([]);
  const { getStreamSessions } = useApi();
  useEffect(() => {
    getStreamSessions(streamId)
      .then(streams => setStreamsSessions(streams))
      .catch(err => console.error(err)); // todo: surface this
  }, [streamId]);
  const isVisible = usePageVisibility();
  useEffect(() => {
    if (!isVisible) {
      return;
    }
    const interval = setInterval(() => {
      getStreamSessions(streamId)
        .then(streams => setStreamsSessions(streams))
        .catch(err => console.error(err)); // todo: surface this
    }, 5000);
    return () => clearInterval(interval);
  }, [streamId, isVisible]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 958,
        mb: [3, 3],
        mx: "auto",
        mt
      }}
    >
      <Table sx={{ gridTemplateColumns: "auto auto auto auto auto" }}>
        <TableRow variant={TableRowVariant.Header}>
          <Box>Sessions</Box>
          <Box>Details</Box>
          <Box>Segments</Box>
          <Box>Created</Box>
          <Box>Last Active</Box>
        </TableRow>
        {streamsSessions.map(stream => {
          const {
            id,
            lastSeen,
            createdAt,
            sourceSegments,
            transcodedSegments
          } = stream;
          return (
            <TableRow key={id}>
              <Box>{`parent id: ${stream.parentId}`}</Box>
              <RenditionsDetails stream={stream} />
              <Box>
                {sourceSegments || 0}/{transcodedSegments || 0}
              </Box>
              <RelativeTime
                id={id}
                prefix="createdat"
                tm={createdAt}
                swap={true}
              />
              <RelativeTime
                id={id}
                prefix="lastSeen"
                tm={lastSeen}
                swap={true}
              />
            </TableRow>
          );
        })}
      </Table>
    </Box>
  );
};
