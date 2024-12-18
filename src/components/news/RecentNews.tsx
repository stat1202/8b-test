'use client';

import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { News } from '@/types/news';
import dynamic from 'next/dynamic';
import SkeletonNewsListItem from '../skeleton/news/SkeletonNewsListItem';
import { useParams } from 'next/navigation';
import { Locale } from '@/types/next-auth';
import { businessAPI } from '@/service/apiInstance';
import { useTranslations } from 'next-intl';
import { diffCreatedTime } from '@/utils/date';

const NewsListItem = dynamic(
  () => import('@/components/shared/NewsListItem'),
  {
    loading: () => <SkeletonNewsListItem type="large" />,
  },
);

function RecentNews() {
  const { locale }: { locale: Locale } = useParams();
  const { ref, inView } = useInView();
  const [newsList, setNewsList] = useState<News[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoadging] = useState(false);
  const t = useTranslations('Date');
  const getNewsList = async () => {
    if (inView && !loading) {
      setLoadging(true);
      const { newsList, lastPage } = await businessAPI.getRecentNews({
        page,
        limit: 20,
        isServer: false,
      });
      if (page < lastPage) {
        setNewsList((prev) => [...prev, ...newsList]);
        setPage((prev) => prev + 1);
      }
    }

    setTimeout(() => {
      setLoadging(false);
    }, 1000);
  };

  useEffect(() => {
    getNewsList();
  }, [inView]);

  return (
    <div className="bg-grayscale-0 p-12 flex flex-col rounded-2xl">
      {newsList.map((news) => (
        <NewsListItem
          type="large"
          news={{
            ...news,
            published_at: t(
              diffCreatedTime(news.published_at).periodType,
              { period: diffCreatedTime(news.published_at).period },
            ),
          }}
          key={news.news_id}
          locale={locale}
        />
      ))}
      <span ref={ref} />
    </div>
  );
}

export default RecentNews;
