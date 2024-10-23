import * as React from "react";
import { Button, Card, Collapse } from "antd";

const { Panel } = Collapse;

const text = (
  <p style={{ paddingLeft: 24 }}>
    A dog is a type of domesticated animal. Known for its loyalty and
    faithfulness, it can be found as a welcome guest in many households across
    the world.
  </p>
);

const Faq = () => {
  return (
    <>
      <Card className="card">
        <h1>FAQ </h1>
        <p>Часто задаваемые вопросы</p>
      </Card>

      <Card className="card">
        <Collapse bordered={false}>
          <Panel header="Вопрос #1" key="1" className="panel">
            {text}
          </Panel>
          <Panel header="Вопрос #2" key="2" className="panel">
            {text}
          </Panel>
          <Panel header="Вопрос #3" key="3" className="panel">
            {text}
          </Panel>
        </Collapse>
      </Card>
    </>
  );
};

export default Faq;
