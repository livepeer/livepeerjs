import Box from "../Box";
import Flex from "../Flex";
import { abbreviateNumber } from "../../lib/utils";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import Spinner from "../../components/Spinner";
import ListItem from "../ListItem";
import Unlink from "../../public/img/unlink.svg";
import Link from "../../public/img/link.svg";
import LPT from "../../public/img/lpt.svg";
import ETH from "../../public/img/eth.svg";
import Play from "../../public/img/play.svg";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";
import historyQuery from "../../queries/historyView.gql";

const Index = () => {
  const router = useRouter();
  const query = router.query;
  const account = query.account as string;

  const { data, loading, error, fetchMore, stopPolling } = useQuery(
    historyQuery,
    {
      variables: {
        account: account.toLowerCase(),
        first: 10,
        skip: 0,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  if (error) {
    console.error(error);
  }

  if (loading && !data) {
    return (
      <Flex
        css={{
          pt: "$5",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Spinner />
      </Flex>
    );
  }

  if (!data?.transactions?.length) {
    return <Box css={{ pt: "$3" }}>No history</Box>;
  }

  const events = data.transactions.reduce(
    (res, { events: e }) => res.concat(e),
    []
  );

  return (
    <InfiniteScroll
      css={{ overflow: "hidden !important" }}
      scrollThreshold={0.5}
      dataLength={data && data.transactions.length}
      next={async () => {
        stopPolling();
        if (!loading && data.transactions.length >= 10) {
          try {
            await fetchMore({
              variables: {
                skip: data.transactions.length,
              },
              updateQuery: (previousResult: any, { fetchMoreResult }: any) => {
                if (!fetchMoreResult) {
                  return previousResult;
                }
                return {
                  ...previousResult,
                  transactions: [
                    ...previousResult.transactions,
                    ...fetchMoreResult.transactions,
                  ],
                };
              },
            });
          } catch (e) {
            return e;
          }
        }
      }}
      hasMore={true}>
      <Box css={{ mt: "$3", mb: "$5", pb: "$4", position: "relative" }}>
        <Box css={{ pb: "$3" }}>
          {events.map((event: any, i: number) => renderSwitch(event, i))}
        </Box>
        {loading && data.transactions.length >= 10 && (
          <Flex
            css={{
              position: "absolute",
              transform: "translateX(-50%)",
              left: "50%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Spinner />
          </Flex>
        )}
      </Box>
    </InfiniteScroll>
  );
};

export default Index;

function renderSwitch(event: any, i: number) {
  switch (event.__typename) {
    case "BondEvent":
      return (
        <ListItem
          onClick={() =>
            window.open(
              `https://etherscan.io/tx/${event.transaction.id}`,
              "_blank"
            )
          }
          css={{
            cursor: "pointer",
            px: "$3",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, .04)" },
          }}
          key={i}
          avatar={<Link css={{ color: "$primary", mr: "$3" }} />}>
          <Flex
            css={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Box>
              <Box>
                Staked with{" "}
                {event.newDelegate.id.replace(
                  event.newDelegate.id.slice(7, 37),
                  "…"
                )}
              </Box>
              <Box css={{ fontSize: 12, color: "$muted" }}>
                {moment
                  .unix(event.transaction.timestamp)
                  .format("MM/DD/YYYY h:mm:ss a")}{" "}
                -- Round #{event.round.id}
              </Box>
            </Box>
            <Box css={{ fontSize: "$2", ml: "$4" }}>
              {" "}
              <Box as="span" css={{ fontFamily: "$monospace" }}>
                +{abbreviateNumber(event.additionalAmount, 3)}
              </Box>{" "}
              LPT
            </Box>
          </Flex>
        </ListItem>
      );
    case "NewRoundEvent":
      return (
        <ListItem
          css={{
            cursor: "pointer",
            px: "$3",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, .04)" },
          }}
          onClick={() =>
            window.open(
              `https://etherscan.io/tx/${event.transaction.id}`,
              "_blank"
            )
          }
          key={i}
          avatar={
            <Play
              css={{ width: 20, height: 20, color: "$primary", mr: "$3" }}
            />
          }>
          <Flex
            css={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Box>
              <Box>Initialized round</Box>
              <Box css={{ fontSize: 12, color: "$muted" }}>
                {moment
                  .unix(event.transaction.timestamp)
                  .format("MM/DD/YYYY h:mm:ss a")}{" "}
                -- Round #{event.round.id}
              </Box>
            </Box>
            <Box css={{ fontSize: "$2", ml: "$4" }}>
              Round #
              <Box as="span" css={{ fontFamily: "$monospace" }}>
                {event.round.id}
              </Box>
            </Box>
          </Flex>
        </ListItem>
      );
    case "RebondEvent":
      return (
        <ListItem
          css={{
            cursor: "pointer",
            px: "$3",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, .04)" },
          }}
          onClick={() =>
            window.open(
              `https://etherscan.io/tx/${event.transaction.id}`,
              "_blank"
            )
          }
          key={i}
          avatar={<Link css={{ color: "$primary", mr: "$3" }} />}>
          <Flex
            css={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Box>
              <Box>
                Restaked with{" "}
                {event.delegate.id.replace(event.delegate.id.slice(7, 37), "…")}
              </Box>
              <Box css={{ fontSize: 12, color: "$muted" }}>
                {moment
                  .unix(event.transaction.timestamp)
                  .format("MM/DD/YYYY h:mm:ss a")}{" "}
                -- Round #{event.round.id}
              </Box>
            </Box>
            <Box css={{ fontSize: "$2", ml: "$4" }}>
              {" "}
              <Box as="span" css={{ fontFamily: "$monospace" }}>
                +{abbreviateNumber(event.amount, 3)}
              </Box>{" "}
              LPT
            </Box>
          </Flex>
        </ListItem>
      );
    case "UnbondEvent":
      return (
        <ListItem
          css={{
            cursor: "pointer",
            px: "$3",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, .04)" },
          }}
          onClick={() =>
            window.open(
              `https://etherscan.io/tx/${event.transaction.id}`,
              "_blank"
            )
          }
          key={i}
          avatar={<Unlink css={{ color: "$primary", mr: "$3" }} />}>
          <Flex
            css={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Box>
              <Box>
                Unstaked from{" "}
                {event.delegate.id.replace(event.delegate.id.slice(7, 37), "…")}
              </Box>
              <Box css={{ fontSize: 12, color: "$muted" }}>
                {moment
                  .unix(event.transaction.timestamp)
                  .format("MM/DD/YYYY h:mm:ss a")}{" "}
                -- Round #{event.round.id}
              </Box>
            </Box>
            <Box css={{ fontSize: "$2", ml: "$4" }}>
              {" "}
              <Box as="span" css={{ fontFamily: "$monospace" }}>
                -{abbreviateNumber(event.amount, 3)}
              </Box>{" "}
              LPT
            </Box>
          </Flex>
        </ListItem>
      );
    case "RewardEvent":
      return (
        <ListItem
          css={{
            cursor: "pointer",
            px: "$3",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, .04)" },
          }}
          onClick={() =>
            window.open(
              `https://etherscan.io/tx/${event.transaction.id}`,
              "_blank"
            )
          }
          key={i}
          avatar={
            <LPT css={{ width: 20, height: 20, color: "$primary", mr: "$3" }} />
          }>
          <Flex
            css={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Box>
              <Box>Claimed inflationary token reward</Box>
              <Box css={{ fontSize: 12, color: "$muted" }}>
                {moment
                  .unix(event.transaction.timestamp)
                  .format("MM/DD/YYYY h:mm:ss a")}{" "}
                -- Round #{event.round.id}
              </Box>
            </Box>
            <Box css={{ fontSize: "$2", ml: "$4" }}>
              {" "}
              <Box as="span" css={{ fontFamily: "$monospace" }}>
                +{abbreviateNumber(event.rewardTokens, 3)}
              </Box>{" "}
              LPT
            </Box>
          </Flex>
        </ListItem>
      );
    case "TranscoderUpdateEvent":
      return (
        <ListItem
          css={{
            cursor: "pointer",
            px: "$3",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, .04)" },
          }}
          onClick={() =>
            window.open(
              `https://etherscan.io/tx/${event.transaction.id}`,
              "_blank"
            )
          }
          key={i}
          avatar={
            <LPT css={{ width: 20, height: 20, color: "$primary", mr: "$3" }} />
          }>
          <Flex
            css={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Box>
              <Box>Updated orchestrator cut</Box>
              <Box css={{ fontSize: 12, color: "$muted" }}>
                {moment
                  .unix(event.transaction.timestamp)
                  .format("MM/DD/YYYY h:mm:ss a")}{" "}
                -- Round #{event.round.id}
              </Box>
            </Box>
            <Box css={{ textAlign: "right", fontSize: "$2", ml: "$4" }}>
              <Box>
                <Box as="span" css={{ fontFamily: "$monospace" }}>
                  {event.rewardCut / 10000}% R
                </Box>{" "}
              </Box>
              <Box>
                <Box as="span" css={{ fontFamily: "$monospace" }}>
                  {(100 - event.feeShare / 10000)
                    .toFixed(2)
                    .replace(/[.,]00$/, "")}
                  % F
                </Box>{" "}
              </Box>
            </Box>
          </Flex>
        </ListItem>
      );
    case "WithdrawStakeEvent":
      return (
        <ListItem
          css={{
            cursor: "pointer",
            px: "$3",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, .04)" },
          }}
          onClick={() =>
            window.open(
              `https://etherscan.io/tx/${event.transaction.id}`,
              "_blank"
            )
          }
          key={i}
          avatar={
            <LPT css={{ width: 20, height: 20, color: "$primary", mr: "$3" }} />
          }>
          <Flex
            css={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Box>
              <Box>Withdrew unstaked tokens</Box>
              <Box css={{ fontSize: 12, color: "$muted" }}>
                {moment
                  .unix(event.transaction.timestamp)
                  .format("MM/DD/YYYY h:mm:ss a")}{" "}
                -- Round #{event.round.id}
              </Box>
            </Box>
            <Box css={{ fontSize: "$2", ml: "$4" }}>
              {" "}
              <Box as="span" css={{ fontFamily: "$monospace" }}>
                {abbreviateNumber(event.amount, 3)}
              </Box>{" "}
              LPT
            </Box>
          </Flex>
        </ListItem>
      );
    case "WithdrawFeesEvent":
      return (
        <ListItem
          css={{
            cursor: "pointer",
            px: "$3",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, .04)" },
          }}
          onClick={() =>
            window.open(
              `https://etherscan.io/tx/${event.transaction.id}`,
              "_blank"
            )
          }
          key={i}
          avatar={
            <ETH css={{ width: 20, height: 20, color: "$primary", mr: "$3" }} />
          }>
          <Flex
            css={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Box>
              <Box>Withdrew earned fees</Box>
              <Box css={{ fontSize: 12, color: "$muted" }}>
                {moment
                  .unix(event.transaction.timestamp)
                  .format("MM/DD/YYYY h:mm:ss a")}{" "}
                -- Round #{event.round.id}
              </Box>
            </Box>
            <Box css={{ fontSize: "$2", ml: "$4" }}>
              {" "}
              <Box as="span" css={{ fontFamily: "$monospace" }}>
                {abbreviateNumber(event.amount, 3)}
              </Box>{" "}
              ETH
            </Box>
          </Flex>
        </ListItem>
      );
    case "WinningTicketRedeemedEvent":
      return (
        <ListItem
          css={{
            cursor: "pointer",
            px: "$3",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, .04)" },
          }}
          onClick={() =>
            window.open(
              `https://etherscan.io/tx/${event.transaction.id}`,
              "_blank"
            )
          }
          key={i}
          avatar={
            <ETH css={{ width: 20, height: 20, color: "$primary", mr: "$3" }} />
          }>
          <Flex
            css={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Box>
              <Box>Redeemed winning ticket</Box>
              <Box css={{ fontSize: 12, color: "$muted" }}>
                {moment
                  .unix(event.transaction.timestamp)
                  .format("MM/DD/YYYY h:mm:ss a")}{" "}
                -- Round #{event.round.id}
              </Box>
            </Box>
            <Box css={{ fontSize: "$2", ml: "$4" }}>
              {" "}
              <Box as="span" css={{ fontFamily: "$monospace" }}>
                +{abbreviateNumber(event.faceValue, 3)}
              </Box>{" "}
              ETH
            </Box>
          </Flex>
        </ListItem>
      );
    case "DepositFundedEvent":
      return (
        <ListItem
          css={{
            cursor: "pointer",
            px: "$3",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, .04)" },
          }}
          onClick={() =>
            window.open(
              `https://etherscan.io/tx/${event.transaction.id}`,
              "_blank"
            )
          }
          key={i}
          avatar={
            <ETH css={{ width: 20, height: 20, color: "$primary", mr: "$3" }} />
          }>
          <Flex
            css={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Box>
              <Box>Deposit funded</Box>
              <Box css={{ fontSize: 12, color: "$muted" }}>
                {moment
                  .unix(event.transaction.timestamp)
                  .format("MM/DD/YYYY h:mm:ss a")}{" "}
                -- Round #{event.round.id}
              </Box>
            </Box>
            <Box css={{ fontSize: "$2", ml: "$4" }}>
              {" "}
              <Box as="span" css={{ fontFamily: "$monospace" }}>
                +{abbreviateNumber(event.amount, 3)}
              </Box>{" "}
              ETH
            </Box>
          </Flex>
        </ListItem>
      );
    case "ReserveFundedEvent":
      // Ignore funded reserve events where amount is 0
      // (unable to do this on the graphql query as of now)
      if (+event.amount === 0) {
        return;
      }
      return (
        <ListItem
          css={{
            cursor: "pointer",
            px: "$3",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, .04)" },
          }}
          onClick={() =>
            window.open(
              `https://etherscan.io/tx/${event.transaction.id}`,
              "_blank"
            )
          }
          key={i}
          avatar={
            <ETH css={{ width: 20, height: 20, color: "$primary", mr: "$3" }} />
          }>
          <Flex
            css={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Box>
              <Box>Reserve funded</Box>
              <Box css={{ fontSize: 12, color: "$muted" }}>
                {moment
                  .unix(event.transaction.timestamp)
                  .format("MM/DD/YYYY h:mm:ss a")}{" "}
                -- Round #{event.round.id}
              </Box>
            </Box>
            <Box css={{ fontSize: "$2", ml: "$4" }}>
              {" "}
              <Box as="span" css={{ fontFamily: "$monospace" }}>
                +{abbreviateNumber(event.amount, 3)}
              </Box>{" "}
              ETH
            </Box>
          </Flex>
        </ListItem>
      );
    default:
      return null;
  }
}
