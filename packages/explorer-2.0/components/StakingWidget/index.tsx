import { Box } from "theme-ui";
import { useState } from "react";
import Header from "./Header";
import ProjectionBox from "./ProjectionBox";
import ArrowDown from "../../public/img/arrow-down.svg";
import Footer from "./Footer";
import { Tabs, TabList, Tab } from "./Tabs";
import { Account, Delegator, Transcoder, Protocol, Round } from "../../@types";
import InputBox from "./InputBox";
import { Flex } from "theme-ui";

interface Props {
  transcoders: [Transcoder];
  transcoder: Transcoder;
  delegator?: Delegator;
  protocol: Protocol;
  account: Account;
  currentRound: Round;
  selectedAction?: string;
}

const Index = ({
  transcoders,
  delegator,
  account,
  transcoder,
  protocol,
  currentRound,
  selectedAction = "stake",
}: Props) => {
  const [amount, setAmount] = useState("");
  const [action, setAction] = useState(selectedAction);

  return (
    <Box className="tour-step-7">
      <Box
        sx={{
          width: "100%",
          boxShadow:
            "rgba(0, 0, 0, 0.03) 0px 0px 1px, rgba(0, 0, 0, 0.06) 0px 4px 8px, rgba(0, 0, 0, 0.06) 0px 16px 24px, rgba(0, 0, 0, 0.03) 0px 24px 32px",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          borderBottomLeftRadius: [0, 0, 0, 16],
          borderBottomRightRadius: [0, 0, 0, 16],
          backgroundColor: "surface",
        }}>
        <Header transcoder={transcoder} />
        <Box sx={{ pt: 1, pb: 2, px: 2 }}>
          <Tabs
            defaultIndex={selectedAction === "stake" ? 0 : 1}
            onChange={(index: number) =>
              setAction(index ? "unstake" : "stake")
            }>
            <TabList>
              <Tab>Stake</Tab>
              <Tab>Unstake</Tab>
            </TabList>
          </Tabs>

          <InputBox
            account={account}
            action={action}
            delegator={delegator}
            transcoder={transcoder}
            amount={amount}
            setAmount={setAmount}
            protocol={protocol}
          />
          <Flex
            sx={{
              alignItems: "center",
              justifyContent: "center",
              width: "95%",
              height: 32,
              margin: "0 auto",
            }}>
            <ArrowDown sx={{ width: 16, color: "rgba(255, 255, 255, .8)" }} />
          </Flex>
          <ProjectionBox action={action} />
          <Footer
            transcoders={transcoders}
            currentRound={currentRound}
            account={account}
            delegator={delegator}
            transcoder={transcoder}
            action={action}
            amount={amount}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Index;
