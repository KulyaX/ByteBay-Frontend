import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LeftOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import axios from 'axios';
import './NewsPage.css';

const NewsPage = () => {
  const { id } = useParams(); // Получаем параметр id из URL
  const [news, setNews] = useState(null); // Состояние для хранения данных новости

  useEffect(() => {
    // Функция для загрузки данных новости с сервера
    const fetchNews = async () => {
      try {
        const response = await axios.get(`http://localhost:1337/api/blogs/${id}?populate=*`);
        setNews(response.data); // Обновляем состояние данных новости
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews(); // Вызываем функцию загрузки данных при монтировании компонента
  }, [id]);

  // Если данные новости еще не загружены, показываем заглушку или индикатор загрузки
  if (!news) {
    return <div>Loading...</div>;
  }

  // Преобразование массива объектов параграфов в строку
  const content = news.data.attributes.blogContent.map(paragraph => paragraph.children.map(child => child.text).join(' ')).join('\n\n');

  const baseUrl = 'http://localhost:1337';

  return (
    <div className='page-container'>
      <div className="news-page">
        <Link to="/">
          <Button type="link" icon={<LeftOutlined />} className="back-button">
            Назад
          </Button>
        </Link>
        <h2 className="news-title">{news.data.attributes.blogTitle}</h2>
        <div className="news-metadata">
          <span className="metadata-item">
            <UserOutlined /> {news.data.attributes.blogAuthor}
          </span>
          <span className="metadata-item">
            <CalendarOutlined /> {news.data.attributes.datePublication}
          </span>
        </div>
        <img src={baseUrl+news.data.attributes.blogImage.data.attributes.url} alt="News" style={{ maxHeight: '441px', maxWidth: '706px' }} />
        <p className="news-content">{content}</p>
      </div>
    </div>
  );
};

export default NewsPage;
