import React, { useState } from "react";
import {
  Layout,
  Input,
  Button,
  Form,
  Typography,
  Card,
  Space,
  message,
  Spin,
  ConfigProvider,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  CopyOutlined,
  EnvironmentTwoTone,
  HeartFilled,
  SmileOutlined,
  FrownOutlined,
  ToolOutlined,
  CheckOutlined,
  StarTwoTone,
  InfoCircleOutlined,
  RocketOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

// Định nghĩa kiểu dữ liệu trả về từ OpenStreetMap
interface NominatimResponse {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
}

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NominatimResponse | null>(null);

  const onFinish = async (values: { address: string }) => {
    setLoading(true);
    setResult(null);

    try {
      // Gọi API Nominatim của OpenStreetMap
      const response = await axios.get<NominatimResponse[]>(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: values.address,
            format: "jsonv2",
            countrycodes: "vn", // Chỉ giới hạn tìm kiếm tại Việt Nam
            limit: 1, // Lấy kết quả khớp nhất
          },
        },
      );

      if (response.data && response.data.length > 0) {
        setResult(response.data[0]);
        message.success(
          <span>
            Tada! Đã tìm thấy vị trí rồi nhé! <SmileOutlined />
          </span>,
        );
      } else {
        message.warning(
          <span>
            Rất tiếc, mình không tìm thấy tọa độ này. Bạn thử nhập địa chỉ chi
            tiết hơn xem sao nhé! <FrownOutlined />
          </span>,
        );
      }
    } catch (error) {
      message.error(
        <span>
          Ôi hỏng! Đã có lỗi xảy ra khi tải dữ liệu. <ToolOutlined />
        </span>,
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success(
      <span>
        Đã lưu vào khay nhớ tạm! <CheckOutlined />
      </span>,
    );
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          colorPrimary: "#FF6B6B", // Màu cam/hồng ấm áp
          borderRadius: 12,
        },
      }}
    >
      <Layout
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)", // Gradient nền nhẹ nhàng
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Content
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <Card
            style={{
              width: "100%",
              maxWidth: 550,
              borderRadius: "24px", // Bo góc mềm mại
              boxShadow: "0 20px 40px rgba(0,0,0,0.08)", // Bóng đổ tạo chiều sâu (wow effect)
              border: "none",
            }}
            bodyStyle={{ padding: "40px 32px" }}
          >
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <EnvironmentTwoTone
                twoToneColor="#FF6B6B"
                style={{ fontSize: "48px", marginBottom: "16px" }}
              />
              <Title level={2} style={{ margin: 0, fontWeight: 800 }}>
                Tìm Tọa Độ Việt Nam <StarTwoTone twoToneColor="#FFD700" />
              </Title>
              <Text type="secondary" style={{ fontSize: "16px" }}>
                Nhập một địa chỉ bất kỳ tại Việt Nam để lấy chính xác vĩ độ và
                kinh độ.
              </Text>
            </div>

            <Form layout="vertical" onFinish={onFinish} size="large">
              <Form.Item
                name="address"
                rules={[
                  {
                    required: true,
                    message: (
                      <span>
                        Bạn quên nhập địa chỉ mất rồi! <InfoCircleOutlined />
                      </span>
                    ),
                  },
                ]}
              >
                <Input
                  autoFocus
                  placeholder="VD: 828 Sư Vạn Hạnh, Phường 13, Quận 10, HCM"
                  prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                  style={{ borderRadius: "12px", padding: "12px 16px" }}
                />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  style={{
                    height: "50px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    borderRadius: "12px",
                    boxShadow: "0 8px 16px rgba(255, 107, 107, 0.3)",
                  }}
                >
                  <Space>
                    Chuyển Đổi Ngay <RocketOutlined />
                  </Space>
                </Button>
              </Form.Item>
            </Form>

            {loading && (
              <div style={{ textAlign: "center", marginTop: "32px" }}>
                <Spin size="large" />
                <div style={{ marginTop: "12px", color: "#888" }}>
                  Đang tìm kiếm vị trí...
                </div>
              </div>
            )}

            {result && !loading && (
              <div
                style={{
                  marginTop: "32px",
                  padding: "24px",
                  backgroundColor: "#FFF5F5",
                  borderRadius: "16px",
                  border: "1px solid #FFE3E3",
                  animation: "fadeIn 0.5s ease-in-out",
                }}
              >
                <Space
                  direction="vertical"
                  style={{ width: "100%" }}
                  size="middle"
                >
                  <div>
                    <Text
                      type="secondary"
                      style={{
                        fontSize: "13px",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                      }}
                    >
                      <EnvironmentOutlined /> Địa chỉ khớp nhất
                    </Text>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        marginTop: "4px",
                        color: "#333",
                      }}
                    >
                      {result.display_name}
                    </div>
                  </div>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Card
                        size="small"
                        style={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        }}
                      >
                        <Text type="secondary">Vĩ độ (Lat)</Text>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "4px",
                          }}
                        >
                          <Text strong style={{ fontSize: "16px" }}>
                            {result.lat}
                          </Text>
                          <Button
                            type="text"
                            shape="circle"
                            icon={<CopyOutlined />}
                            onClick={() => copyToClipboard(result.lat)}
                          />
                        </div>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card
                        size="small"
                        style={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        }}
                      >
                        <Text type="secondary">Kinh độ (Lon)</Text>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "4px",
                          }}
                        >
                          <Text strong style={{ fontSize: "16px" }}>
                            {result.lon}
                          </Text>
                          <Button
                            type="text"
                            shape="circle"
                            icon={<CopyOutlined />}
                            onClick={() => copyToClipboard(result.lon)}
                          />
                        </div>
                      </Card>
                    </Col>
                  </Row>

                  <Button
                    block
                    style={{
                      marginTop: "8px",
                      height: "45px",
                      borderRadius: "12px",
                      fontWeight: "bold",
                      borderColor: "#FF6B6B",
                      color: "#FF6B6B",
                    }}
                    href={`https://www.google.com/maps/search/?api=1&query=${result.lat},${result.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Space>
                      <GlobalOutlined /> Mở trên Google Maps
                    </Space>
                  </Button>
                </Space>
              </div>
            )}
          </Card>
        </Content>

        <Footer
          style={{
            textAlign: "center",
            background: "transparent",
            color: "#888",
          }}
        >
          Được xây dựng với tình yêu{" "}
          <HeartFilled style={{ color: "#FF6B6B" }} /> và OpenStreetMap API
        </Footer>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
