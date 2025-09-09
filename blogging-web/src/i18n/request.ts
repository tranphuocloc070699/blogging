import {getRequestConfig} from 'next-intl/server';
import {headers} from 'next/headers';

export default getRequestConfig(async () => {
  const host = await headers().then(header => header.get("host") || "")
  const subdomain = host.split('.')[0]; // e.g., "en" from "en.localhost:3000"
  const locale = ['en', 'vi'].includes(subdomain) ? subdomain : 'en';
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});