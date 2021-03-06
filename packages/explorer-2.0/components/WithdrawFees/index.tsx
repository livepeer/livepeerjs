import { useContext } from "react";
import { useWeb3React } from "@web3-react/core";
import Button from "../Button";
import { MutationsContext } from "../../contexts";
import { useApolloClient } from "@apollo/client";
import { initTransaction } from "../../lib/utils";

const Index = ({ delegator, ...props }) => {
  const context = useWeb3React();
  const client = useApolloClient();
  const { withdrawFees }: any = useContext(MutationsContext);

  if (!context.active) {
    return null;
  }
  return (
    <>
      <Button
        color="primary"
        onClick={() => {
          initTransaction(client, async () => {
            await withdrawFees({
              variables: {
                delegator: delegator?.id,
                lastClaimRound: parseInt(delegator?.lastClaimRound.id, 10),
              },
            });
          });
        }}
        {...props}
      >
        Withdraw
      </Button>
    </>
  );
};

export default Index;
