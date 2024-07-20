'use client';

import {
  getExchangePrice,
  getFormat,
  getStockStyle,
} from '@/utils/stock';
import React, { useEffect, useState } from 'react';
import ToggleButton from '../shared/ToggleButton';
import { useLocale } from 'next-intl';
import { businessAPI } from '@/service/apiInstance';
import { Locale } from '@/types/next-auth';
import { Stock } from '@/types/stock';

type ExchangeRate = {
  locale: Locale;
  exchange_rate: number;
};

export default function StockDescription() {
  const locale = useLocale() as Locale;
  const [isDollar, setIsDollar] = useState(true);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate[]>();

  const [stock, setStock] = useState<Stock>();

  const getExchangeRate = async () => {
    const data = await businessAPI.getExchangeRate();
    setExchangeRate(data);
  };

  const getStock = async () => {
    const data = await businessAPI.getPopularStock();
    setStock(data.stocks[0]);
  };

  useEffect(() => {
    getStock();

    getExchangeRate();

    const intervalId = setInterval(() => {
      getExchangeRate();
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="flex justify-between mb-8">
        <div>
          <div className="flex items-center gap-[2px]">
            <span className="b1 font-bold text-primary-900">
              {isDollar
                ? exchangeRate &&
                  getExchangePrice(
                    exchangeRate.find((e) => e.locale === 'en')!
                      .exchange_rate,
                    exchangeRate.find((e) => e.locale === 'en')!
                      .exchange_rate,
                    300, //stcok_price
                    'en',
                  )
                : exchangeRate &&
                  getExchangePrice(
                    exchangeRate.find((e) => e.locale === 'en')!
                      .exchange_rate,
                    exchangeRate.find((e) => e.locale === locale)!
                      .exchange_rate,
                    300, //stcok_price
                    locale,
                  )}
            </span>
            <span className="b2 font-normal text-primary-900">∙</span>
            <span className="b2 font-normal text-primary-900">
              AAPL
            </span>
          </div>
          <span
            className={`b2 font-medium ${
              stock &&
              getStockStyle(
                stock?.compare_to_previous_close_price,
                stock?.fluctuations_ratio,
              ).color
            }`}
          >
            {stock &&
              `
              ${
                getStockStyle(
                  stock?.compare_to_previous_close_price,
                  stock?.fluctuations_ratio,
                ).comparePrice
              }
              ${
                getStockStyle(
                  stock?.compare_to_previous_close_price,
                  stock?.fluctuations_ratio,
                ).ratio
              }
            `}
          </span>
        </div>
        {/* Toggle Button */}
        <ToggleButton
          isDollar={isDollar}
          setIsDollar={setIsDollar}
          locale={locale}
        />
      </div>
      <p className="b4 font-normal text-grayscale-900">
        애플은 스마트폰, 개인용 컴퓨터, 태블릿, 웨어러블 및 액세서리를
        설계, 제조 및 판매하고 다양한 관련 서비스를 판매한다. 제품
        카테고리는 iPhone, MAc, iPad, Wearables, Home 및 Accessories로
        나뉜다.
      </p>
    </>
  );
}
