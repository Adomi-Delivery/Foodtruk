'use client'

import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';

export default function DashboardLayout({children}: {children: React.ReactNode}) {
  
  const { Header, Sider, Content } = Layout;
  
    const [collapsed, setCollapsed] = useState(false);
    const {token: { colorBgContainer },} = theme.useToken();

    return (
      <Layout>
          <Content
            style={{
              height: '100vh',
              background: colorBgContainer,
            }}
          >
            {children}
          </Content>
      </Layout>
    );
  }
