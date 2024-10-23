import React, { useState } from 'react';
import { Card, Input, Button, ColorPicker, Space, Row, Col, Typography, Collapse, Flex, Tabs } from 'antd';
import { Color } from 'antd/es/color-picker';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import 'embed-visualizer/dist/index.css'

//@ts-ignore
import { EmbedVisualizer, parseContent, parseTitle } from 'embed-visualizer';
interface EmbedProps {
  onGenerate: (embedData: EmbedData) => void;
}

interface EmbedField {
  name: string;
  value: string;
  inline: boolean;
}

interface EmbedData {
  content: string,
  title: string;
  description: string;
  color: string;
  author: string;
  authorIcon: string;
  footer: string;
  footerIcon: string;
  thumbnail: string;
  fields: EmbedField[];
}

const DiscordEmbed: React.FC<EmbedProps> = ({ onGenerate }) => {
  const [embedData, setEmbedData] = useState<EmbedData>({
    content: "s",
    title: 'asd',
    description: 'asd',
    color: '#000000',
    author: 'asd',
    authorIcon: 'asd',
    footer: 'asd',
    footerIcon: 'asd',
    thumbnail: 'asd',
    fields: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmbedData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (color: Color) => {
    setEmbedData(prev => ({ ...prev, color: color.toHexString() }));
  };

  const handleFieldChange = (index: number, key: keyof EmbedField, value: string | boolean) => {
    const newFields = [...embedData.fields];
    newFields[index] = { ...newFields[index], [key]: value };
    setEmbedData(prev => ({ ...prev, fields: newFields }));
  };

  const addField = () => {
    setEmbedData(prev => ({
      ...prev,
      fields: [...prev.fields, { name: '', value: '', inline: false }],
    }));
  };

  const removeField = (index: number) => {
    setEmbedData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }));
  };

  const handleGenerate = () => {
    onGenerate(embedData);
  };
  
  return (
    <Collapse bordered={false} >
      <Collapse.Panel key='1' header='asd' style={{width: "100%"}}>
        
        <Space direction="vertical" style={{ width: '100%' }}>

          <Collapse bordered={false} style={{flexDirection: "column"}}>

            <Collapse.Panel header='Предпросмотр' key={'view'}>
              <EmbedVisualizer embed={{embed: embedData}}  />

            </Collapse.Panel>

            <Tabs defaultActiveKey="1" style={{border: "0"}}>

                <Tabs.TabPane tab={<p style={{padding: "20px"}}>Текст</p>} key="2" style={{padding: "20px"}}>
                  <Input.TextArea
                      name="description"
                      placeholder="Текст"
                      value={embedData.content}
                      onChange={handleInputChange}
                    />
                </Tabs.TabPane>

                <Tabs.TabPane tab={<p style={{padding: "20px"}}>Панель</p>} key="1" style={{padding: "20px"}}>

                  <Space>
                    <Typography.Text>Цвет:</Typography.Text>
                    <ColorPicker value={embedData.color} onChange={handleColorChange} />
                  </Space>

                  <Collapse bordered={false} style={{flexDirection: "column"}}>

                      <Collapse.Panel key='header' header="Автор">
                      <Flex vertical gap={10}>
                        <Input  
                          name="author"
                          placeholder="Автор"
                          value={embedData.author}
                          onChange={handleInputChange}
                        />
                        <Input
                          name="authorIcon"
                          placeholder="URL иконки автора"
                          value={embedData.authorIcon}
                          onChange={handleInputChange}
                        />

                        <Input
                          name="thumbnail"
                          placeholder="URL миниатюры"
                          value={embedData.thumbnail}
                          onChange={handleInputChange}
                        />
                      </Flex>
                      </Collapse.Panel>

                      <Collapse.Panel key='body' header='Body'>
                      <Flex vertical gap={10}>
                          <Input
                          name="title"
                          placeholder="Заголовок"
                          value={embedData.title}
                          onChange={handleInputChange}
                        />

                        <Input.TextArea
                          name="description"
                          placeholder="Описание"
                          value={embedData.description}
                          onChange={handleInputChange}
                        />

                        <Input
                          name="footer"
                          placeholder="Футер"
                          value={embedData.footer}
                          onChange={handleInputChange}
                        />

                        <Input
                          name="footerIcon"
                          placeholder="URL иконки футера"
                          value={embedData.footerIcon}
                          onChange={handleInputChange}
                        />
                      </Flex>
                      </Collapse.Panel>

                      <Collapse.Panel key='fields' header="Поля">
                        <Flex vertical gap={15}>

                        {embedData.fields.map((field, index) => (
                          <Row key={index} gutter={[8, 8]} align="middle">
                            <Col span={8}>
                              <Input
                                placeholder="Название поля"
                                value={field.name}
                                onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                              />
                            </Col>
                            <Col span={8}>
                              <Input
                                placeholder="Значение поля"
                                value={field.value}
                                onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                              />
                            </Col>
                            <Col span={6}>
                              <Button
                                type={field.inline ? 'primary' : 'default'}
                                onClick={() => handleFieldChange(index, 'inline', !field.inline)}
                              >
                                {field.inline ? 'Inline' : 'Not Inline'}
                              </Button>
                            </Col>
                            <Col span={2}>
                              <Button
                                icon={<MinusCircleOutlined />}
                                onClick={() => removeField(index)}
                                danger
                              />
                            </Col>
                          </Row>
                      ))}
                      <Button icon={<PlusOutlined />} onClick={addField}>Добавить поле</Button>
                        </Flex>
                      </Collapse.Panel>

                  </Collapse>

                  
                </Tabs.TabPane>

            </Tabs>
            
          </Collapse>

        </Space>
      </Collapse.Panel>
    </Collapse>
  );
};

export default DiscordEmbed;