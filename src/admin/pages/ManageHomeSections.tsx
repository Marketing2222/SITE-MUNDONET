import { useEffect, useState } from 'react';
import { apiFetch } from '../hooks/useAuth';
import ManageQuickLinks from './ManageQuickLinks';
import ManageBenefits from './ManageBenefits';
import { RichTextField } from '../components/RichTextField';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { ColorPicker } from '../components/ColorPicker';
import { API_BASE_URL } from '../../config/api';
import { EXIT_ICON_OPTIONS } from '../../components/ExitPopup';

interface Setting { key: string; value: string; label: string; }

type FieldType = 'text' | 'url' | 'textarea' | 'image' | 'color' | 'toggle' | 'font' | 'spacing' | 'list' | 'align' | 'select';

interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  hint?: string;
  options?: { value: string; label: string }[];
}

const ICON_PATHS: Record<string, string> = {
  whatsapp: 'M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z',
  phone: 'M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.3l-224 96C6.7 100.3 0 109.6 0 120.4V376.1c0 11.9 6.7 22.2 17.1 27.5l224 96c19.4 5.2 39.7-4.7 47.4-23.3l164-368c4.5-10.8-2.8-23.3-14.1-23.3H179.1c-11.3 0-22.8 7.5-27.1 18.7zM256 352c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm-96-80V161.4L395.8 128 160 74.6 160 272z',
  email: 'M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4C504.9 141.3 512 127.1 512 112c0-26.5-21.5-48-48-48H48zM0 176v208c0 35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64V176L256 288 0 176z',
  support: 'M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM388.3 320H235.7c-8.8 0-16 7.2-16 16s7.2 16 16 16H388.3c8.8 0 16-7.2 16-16s-7.2-16-16-16zm0 64H235.7c-8.8 0-16 7.2-16 16s7.2 16 16 16H388.3c8.8 0 16-7.2 16-16s-7.2-16-16-16zM123.7 288H276.3c8.8 0 16-7.2 16-16s-7.2-16-16-16H123.7c-8.8 0-16 7.2-16 16s7.2 16 16 16zm0 64H276.3c8.8 0 16-7.2 16-16s-7.2-16-16-16H123.7c-8.8 0-16 7.2-16 16s7.2 16 16 16zM256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48zm0 368c-88.4 0-160-71.6-160-160S167.6 96 256 96s160 71.6 160 160-71.6 160-160 160z',
  chat: 'M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 49.6 21.3 95.1 56.9 130.8L16 480l123.5-48.2C211.4 442 233 448 256 448z',
  user: 'M224 256a128 128 0 1 0 0-256 128 128 0 1 0 0 256zm-45.7 48C141.8 304 64 369.6 64 448h320c0-78.4-77.8-144-173.7-144H178.3z',
  globe: 'M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64h185.4c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.6 142 77.5 171.9 151.6zm-326.2 0C71.1 119.4 51.4 172.9 41.4 236.8H116.7c29.9-74.1 93.6-131 171.9-151.6zM0 256c0-22.2 1.2-43.6 3.3-64H153.7c2.2 20.4 3.3 41.8 3.3 64s-1.2 43.6-3.3 64H3.3C1.2 299.6 0 278.2 0 256zM380.8 64H347.5c36.5 29.7 65.6 73.8 84 128H483.9c-29.9-74.1-93.6-131-103.1-128zM256 0c29.6 0 58 5.6 84 16H208c26-10.4 54.4-16 84-16z',
  shield: 'M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.7 363.2c-16.7 8-36.1 8-52.8 0C57.3 410.7 16.5 229.2 16 130c-.1-26.5 16-48.5 38-57.8L242.7 2.9C246.8 1 251.4 0 256 0z',
  star: 'M316.9 18C311.3 7 300.5 0 289.1 0H186.9C175.5 0 164.7 7 159.1 18L95.8 190.5c-8.4 16.1-.8 35.5 15.7 41.7l46.6 18.1 18.1 46.6c6.2 16.5 25.6 24.1 41.7 15.7L253.3 317c10.8-5.8 17.6-17 17.6-29.1s-6.8-23.3-17.6-29.1L193 196.4c-16.6-8.4-24.2-27.8-15.7-41.7L194 98c5.6-11.1 16.4-18 27.8-18h64.4c11.4 0 22.2 6.9 27.8 18l15.7 41.7c8.4 16.1.8 35.5-15.7 41.7l-46.6 18.1-18.1 46.6c-6.2 16.5-25.6 24.1-41.7 15.7L97.3 266.8c-10.8 5.8-17.6 17-17.6 29.1 0 12.1 6.8 23.3 17.6 29.1l54.5 27.8c16.5 8.4 24.1 27.8 15.7 41.7L138.5 445c-5.6 11.1-16.4 18-27.8 18H92.9c-11.4 0-22.2-6.9-27.8-18L49.4 403.3c-8.4-16.1-.8-35.5 15.7-41.7l46.6-18.1 18.1-46.6c6.2-16.5 25.6-24.1 41.7-15.7L224 308.6c10.8-5.8 17.6-17 17.6-29.1s-6.8-23.3-17.6-29.1L169.5 211.4c-16.5-8.4-24.1-27.8-15.7-41.7L168 128c5.6-11.1 16.4-18 27.8-18h16.4c11.4 0 22.2 6.9 27.8 18l15.7 41.7c8.4 16.1.8 35.5-15.7 41.7l-46.6 18.1-18.1 46.6c-6.2 16.5-25.6 24.1-41.7 15.7L268 297.8c10.8 5.8 17.6 17 17.6 29.1 0 12.1-6.8 23.3-17.6 29.1l-54.5 27.8c-16.5 8.4-24.1 27.8-15.7 41.7l15.7 41.7c5.6 11.1 16.4 18 27.8 18h16.4c11.4 0 22.2-6.9 27.8-18l15.7-41.7c8.4-16.1.8-35.5-15.7-41.7l-46.6-18.1-18.1-46.6c-6.2-16.5-25.6-24.1-41.7-15.7l-44.7 22.8c-10.8 5.8-17.6 17-17.6 29.1s6.8 23.3 17.6 29.1l44.7 22.8c16.5 8.4 24.1 27.8 15.7 41.7L316.9 474c-5.6 11.1-16.4 18-27.8 18h-16.4c-11.4 0-22.2-6.9-27.8-18l-15.7-41.7c-8.4-16.1-.8-35.5 15.7-41.7l46.6-18.1 18.1-46.6c6.2-16.5 25.6-24.1 41.7-15.7l44.7 22.8c10.8-5.8 17.6-17 17.6-29.1s-6.8-23.3-17.6-29.1l-44.7 22.8c-16.5 8.4-24.1 27.8-15.7 41.7l15.7 41.7c5.6 11.1 16.4 18 27.8 18h16.4c11.4 0 22.2-6.9 27.8-18l15.7-41.7c8.4-16.1.8-35.5-15.7-41.7l-46.6-18.1-18.1-46.6c-6.2-16.5-25.6-24.1-41.7-15.7l-44.7 22.8c-10.8 5.8-17.6 17-17.6 29.1s6.8 23.3 17.6 29.1l44.7 22.8c16.5 8.4 24.1 27.8 15.7 41.7l-15.7 41.7c-5.6 11.1-16.4 18-27.8 18H320.3c-11.4 0-22.2-6.9-27.8-18l-15.7-41.7c-8.4-16.1-.8-35.5 15.7-41.7l46.6-18.1 18.1-46.6c6.2-16.5 25.6-24.1 41.7-15.7l44.7 22.8c10.8-5.8 17.6-17 17.6-29.1s-6.8-23.3-17.6-29.1L363.9 18C359.3 7 348.5 0 337.1 0H316.9z',
  heart: 'M47.6 300.4L223.6 466.4c8.9 8.9 23.4 8.9 32.3 0L464.4 300.4c8.9-8.9 8.9-23.4 0-32.3s-23.4-8.9-32.3 0L256 409.6 80 268c-8.9-8.9-23.4-8.9-32.3 0s-8.9 23.4 0 32.3z',
  gift: 'M123.6 3.5C129.1 1.5 135.3.5 141.6.5h128.8c6.3 0 12.5 1 18 3l93.9 33.9c22.2 8 37.1 29 37.1 53c0 20.1-12.5 37.8-30.7 44.6l-47 17.1V184c0 22.1-17.9 40-40 40H272V312c0 22.1-17.9 40-40 40H160v64c0 22.1-17.9 40-40 40H40c-22.1 0-40-17.9-40-40V224c0-22.1 17.9-40 40-40h8V120.6l44.7-16.3L123.6 3.5zM352 184V153.9l47-17.1c6.3-2.3 10.5-8.3 10.5-15c0-4.7-2.1-9.1-5.7-12.1L355.1 79.8 317.8 66.2V184h34.2zM160 184V66.2l-37.3 13.6L78 99.7c-3.7 3-5.7 7.4-5.7 12.1c0 6.7 4.2 12.7 10.5 15l47 17.1V184H160z',
  clock: 'M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H192c-13.3 0-24-10.7-24-24s10.7-24 24-24h80c13.3 0 24 10.7 24 24v64h16c13.3 0 24 10.7 24 24s-10.7 24-24 24H232c-13.3 0-24-10.7-24-24s10.7-24 24-24z',
  download: 'M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-12.5 12.5-32.8 12.5-45.3 0L210.5 352H64z',
  wifi: 'M508.5 111.9c-4.5-8.2-13.4-13.3-22.8-13.3H294.7c-14.2 0-27.1 8.3-33 21.2l-18.3 39.6c-4.3-1.2-8.8-1.8-13.4-1.8H86.3c-8.2 0-16 3.3-21.7 9.2L28.6 215.9c-8 8.3-12.5 19.5-12.5 31.2c0 22.5 18.2 40.8 40.8 40.8H141c14.2 0 27.1-8.3 33-21.2l18.3-39.6c4.3 1.2 8.8 1.8 13.4 1.8h167.1c8.2 0 16-3.3 21.7-9.2l36-37.8c8-8.3 12.5-19.5 12.5-31.2c0-22.5-18.2-40.8-40.8-40.8H282c-14.2 0-27.1 8.3-33 21.2l-18.3 39.6c-4.3-1.2-8.8-1.8-13.4-1.8H98.6c-8.2 0-16 3.3-21.7 9.2L29 279.6c-8 8.3-12.5 19.5-12.5 31.2c0 22.5 18.2 40.8 40.8 40.8H137c14.2 0 27.1-8.3 33-21.2l18.3-39.6c4.3-1.2 8.8-1.8 13.4-1.8h167.1c8.2 0 16-3.3 21.7-9.2l36-37.8c8-8.3 12.5-19.5 12.5-31.2c0-22.5-18.2-40.8-40.8-40.8H278c-14.2 0-27.1 8.3-33 21.2l-18.3 39.6c-4.3-1.2-8.8-1.8-13.4-1.8H86.3c-8.2 0-16 3.3-21.7 9.2L28.6 387.9c-8 8.3-12.5 19.5-12.5 31.2c0 22.5 18.2 40.8 40.8 40.8H141c14.2 0 27.1-8.3 33-21.2l18.3-39.6c4.3-1.2 8.8-1.8 13.4-1.8h167.1c8.2 0 16-3.3 21.7-9.2l36-37.8c8-8.3 12.5-19.5 12.5-31.2c0-22.5-18.2-40.8-40.8-40.8H282c-14.2 0-27.1 8.3-33 21.2l-18.3 39.6c-4.3-1.2-8.8-1.8-13.4-1.8H98.6c-8.2 0-16 3.3-21.7 9.2L29 479.6c-8 8.3-12.5 19.5-12.5 31.2c0 22.5 18.2 40.8 40.8 40.8H141c14.2 0 27.1-8.3 33-21.2l18.3-39.6c4.3-1.2 8.8-1.8 13.4-1.8h167.1c8.2 0 16-3.3 21.7-9.2l36-37.8c8-8.3 12.5-19.5 12.5-31.2c0-22.5-18.2-40.8-40.8-40.8H278c-14.2 0-27.1 8.3-33 21.2l-18.3 39.6c-4.3-1.2-8.8-1.8-13.4-1.8H86.3c-8.2 0-16 3.3-21.7 9.2L28.6 575.9c-8 8.3-12.5 19.5-12.5 31.2c0 22.5 18.2 40.8 40.8 40.8H141c14.2 0 27.1-8.3 33-21.2l18.3-39.6c4.3-1.2 8.8-1.8 13.4-1.8h167.1c8.2 0 16-3.3 21.7-9.2l36-37.8c8-8.3 12.5-19.5 12.5-31.2c0-22.5-18.2-40.8-40.8-40.8H282c-14.2 0-27.1 8.3-33 21.2l-18.3 39.6c-4.3-1.2-8.8-1.8-13.4-1.8H98.6c-8.2 0-16 3.3-21.7 9.2L29 671.9c-8 8.3-12.5 19.5-12.5 31.2c0 22.5 18.2 40.8 40.8 40.8H141c14.2 0 27.1-8.3 33-21.2l18.3-39.6c4.3-1.2 8.8-1.8 13.4-1.8h167.1c8.2 0 16-3.3 21.7-9.2l36-37.8c8-8.3 12.5-19.5 12.5-31.2c0-22.5-18.2-40.8-40.8-40.8H278z',
  router: 'M96 64c0-35.3 28.7-64 64-64H512c35.3 0 64 28.7 64 64V224H96V64zM0 224c0-35.3 28.7-64 64-64v192c-35.3 0-64-28.7-64-64V224zm576 0c0-35.3 28.7-64 64-64v192c-35.3 0-64-28.7-64-64V224zM96 288H544V448c0 35.3-28.7 64-64 64H160c-35.3 0-64-28.7-64-64V288zm96 32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32s32-14.3 32-32V352c0-17.7-14.3-32-32-32zm128 0c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32s32-14.3 32-32V352c0-17.7-14.3-32-32-32zm128 0c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32s32-14.3 32-32V352c0-17.7-14.3-32-32-32z',
  speed: 'M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H192c-13.3 0-24-10.7-24-24s10.7-24 24-24h80c13.3 0 24 10.7 24 24v64h16c13.3 0 24 10.7 24 24s-10.7 24-24 24H232c-13.3 0-24-10.7-24-24s10.7-24 24-24z',
  signal: 'M32 32c17.7 0 32 14.3 32 32V416c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7 14.3-32 32-32s32 14.3 32 32V384c0 17.7 14.3 32 32 32s32-14.3 32-32V96c0-17.7 14.3-32 32-32s32 14.3 32 32V352c0 17.7 14.3 32 32 32s32-14.3 32-32V128c0-17.7 14.3-32 32-32s32 14.3 32 32V288c0 17.7 14.3 32 32 32s32-14.3 32-32V160c0-17.7 14.3-32 32-32s32 14.3 32 32V320c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7 14.3-32 32-32s32 14.3 32 32V224c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7 14.3-32 32-32s32 14.3 32 32V192c0 17.7 14.3 32 32 32s32-14.3 32-32V0c0-17.7 14.3-32 32-32s32 14.3 32 32V160c0 17.7 14.3 32 32 32s32-14.3 32-32V32z',
  wrench: 'M352 320c88.4 0 160-71.6 160-160c0-15.6-2.2-30.7-6.2-45c-2.9-10.6-11-19.3-21.8-21.2c-11.2-2-22.6-2.4-33.8-1.5c-23.5 1.9-43.6 17.9-48.6 41.1c-1.5 6.9-2.9 13.9-3.9 21c-1.7 12-5.1 23.6-10.3 34.5c-8.6 18.2-23.5 33-43.1 40.8c-18.2 7.4-38.6 6.8-56.2-1.6c-16-7.4-29.4-19.8-38-35.4c-12.4-22.3-17.6-48.4-14.8-74.3C68.3 163.3 32 130.5 32 91.2C32 49.4 65.8 16 107.6 16c30.7 0 58.7 18.3 70.6 46c7.4 17.5 21.7 31.1 39.6 38.3c13.2 5.3 27.5 8 41.8 8c35.3 0 68-16.6 89-43.9C365 16.2 383.7 0 405.4 0C447 0 480 32.7 480 73c0 23.6-10.4 44.9-26.8 59.6c-4.2 3.7-8.7 7.2-13.4 10.4c14.6 14.5 23.2 34.2 23.2 55.6c0 43.9-34.7 79.6-77.4 81.4c-8.7.4-17.4-.5-25.8-2.7c-5.3 11.3-14.7 20.3-26.1 25.3c-15.7 6.9-33.2 7.2-48.6-.4c-12.2-6-21.6-17-25.6-30.6c-3.2-10.8-3.8-22.3-1.8-33.4c4.2-23.1 19.8-42.2 40.6-50.5C327.8 327.4 339.8 320 352 320z',
  gear: 'M495.9 212.5c1.3-8.7 2.1-17.6 2.1-26.5c0-44.8-16.3-85.9-43.4-117.9c-2.5-3-6.6-3.9-10.1-2.2C431.5 72.4 421.3 80 410.2 85.2C394.2 74.3 375.6 67.2 356 64.3c-3.3-25.5-17.3-48.3-38.6-62.2c-3.2-2.1-7.3-1.6-10 1.2C282.8 31 259.6 56.4 256 87.2C252.4 56.4 229.2 31 204.6 3.3c-2.7-2.8-6.8-3.3-10-1.2C173.3 16 159.3 38.8 156 64.3C136.4 67.2 117.8 74.3 101.8 85.2C90.7 80 80.5 72.4 67.6 68.9c-3.5-1.7-7.6-.8-10.1 2.2C27.6 103.3 11.3 144.4 11.3 189.2c0 8.9.8 17.8 2.1 26.5c-6.5 9.4-10.7 20.5-10.7 32.3c0 13.4 5.3 25.5 13.8 34.5c2.8 3 3.7 7.1 2.1 10.8c-6.8 15.7-10.7 33.1-10.7 51.4c0 30.8 12.5 58.7 32.8 78.9c2.4 2.4 6.2 2.8 9 1c13.8-8.9 29.6-14.6 46.7-16.5c3.6 21.3 13.3 40.6 28.2 55c2.5 2.5 6.3 3 9.4 1.2C204.2 464.8 229.2 472 256 472c26.8 0 51.8-7.2 74.1-19.9c3.1-1.8 6.9-1.3 9.4-1.2c14.9 14.4 24.6 33.7 28.2 55c17.1 1.9 32.9 7.6 46.7 16.5c2.8 1.8 6.6 1.4 9-1c20.3-20.2 32.8-48.1 32.8-78.9c0-18.3-3.9-35.7-10.7-51.4c-1.6-3.7-.7-7.8 2.1-10.8c8.5-9 13.8-21.1 13.8-34.5c0-11.8-4.2-22.9-10.7-32.3zM256 312c-44.2 0-80-35.8-80-80s35.8-80 80-80s80 35.8 80 80s-35.8 80-80 80z',
  document: 'M320 448v40c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V192c0-13.3 10.7-24 24-24h144c13.3 0 24 10.7 24 24v40h8c13.3 0 24 10.7 24 24zM0 192v240c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H192L144 0H64C28.7 0 0 28.7 0 64v128z',
  gamepad: 'M192 64C86 64 0 150 0 256S86 448 192 448H448c106 0 192-86 192-192S554 64 448 64H192zM256 328c0 13.3-10.7 24-24 24s-24-10.7-24-24V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h40V192c0-13.3 10.7-24 24-24s24 10.7 24 24v40h40c13.3 0 24 10.7 24 24s-10.7 24-24 24H304v40zM360 248c-13.3 0-24 10.7-24 24s10.7 24 24 24h16v16c0 13.3 10.7 24 24 24s24-10.7 24-24V296h16c13.3 0 24-10.7 24-24s-10.7-24-24-24H400V208c0-13.3-10.7-24-24-24s-24 10.7-24 24v16h-16z',
  dollar: 'M160 0c17.7 0 32 14.3 32 32V64 96c88.4 0 160 71.6 160 160s-71.6 160-160 160V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V416C39.6 416 0 340 0 256S39.6 96 128 96V64c0-17.7 14.3-32 32-32zm0 128c-44.2 0-80 35.8-80 80s35.8 80 80 80V128z',
  handshake: 'M323.4 85.2l-14.2 14.2-22.6-16.1c-8.2-5.8-18.8-5.8-27 0L203.1 99.3l-14.2-14.2c-9.4-9.4-24.6-9.4-33.9 0l-11.3 11.3c-9.4 9.4-9.4 24.6 0 33.9L159 153.8l-38.7 38.7-42.3-36.3c-5.3-4.5-12.5-5.5-18.8-2.7L30.1 165.8c-7.7 3.4-11.8 12.2-8.4 19.9s12.2 11.8 19.9 8.4l29.2-12.9 42.3 36.3c5.3 4.5 12.5 5.5 18.8 2.7l53.6-23.8 14.2 14.2c9.4 9.4 24.6 9.4 33.9 0l33.9-33.9c9.4-9.4 9.4-24.6 0-33.9zM198.3 277.8L86.7 415.5c-5.3 6.5-4.2 16 2.7 21.1l49.4 36.3c6.3 4.6 15.2 3.4 20-2.8l101.1-130.1c-20.6-19.4-33.4-46.5-33.4-76.8c0-13.1 2.5-25.6 7.1-37.1l-34.4-28.4zM320 288c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32zm143.3-56.6c-9.4-9.4-24.6-9.4-33.9 0l-14.2 14.2c-9.4 9.4-9.4 24.6 0 33.9l23.1 23.1c9.4 9.4 24.6 9.4 33.9 0l14.2-14.2c9.4-9.4 9.4-24.6 0-33.9l-23.1-23.1zm-180.5-9.9l34.4 28.4c4.6 11.5 7.1 24 7.1 37.1c0 30.3-12.8 57.4-33.4 76.8l-57.6-74.1c-1.4-1.8-3-3.4-4.8-4.8l70.3-63.4zM552 176.6c-6.9-4.9-16.1-5.5-23.7-1.5L397.4 238.9c-22.4 15.7-37.4 41.8-37.4 71.1c0 13.1 2.5 25.6 7.1 37.1L344 366.7l-42.3 36.3c-5.3 4.5-8.3 11.1-8.3 18.1c0 6.8 2.9 13.3 8.1 17.9l101.1 74c6.5 4.8 15.5 3.5 20.3-3l148.9-199.3c7-9.3 5.2-22.2-4.1-29.2L552 176.6z',
  map: 'M408 120c0 44.1-35.9 80-80 80s-80-35.9-80-80 35.9-80 80-80 80 35.9 80 80zM0 501.8C0 432.1 56.3 375.8 126.1 375.8h15.9c23.3 0 44.3-13.3 54.3-33.9L221.9 280H240l49.3 61.6c10 20.6 31 33.4 54.3 33.4h15.9C447.1 375.8 464 392.7 464 414.3v31.5C464 488.7 424.7 528 376.6 528H199.4C151.3 528 112 488.7 112 445.8v-31.5C112 392.7 93.3 375.8 69.3 375.8H53.4C23.9 375.8 0 399.7 0 429.2V501.8zM509.8 120c0 44.1-35.9 80-80 80s-80-35.9-80-80 35.9-80 80-80 80 35.9 80 80zM488 32H352c-17.7 0-32 14.3-32 32V120c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16V80h32c8.8 0 16-7.2 16-16V48c0-8.8-7.2-16-16-16z',
  camera: 'M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3l-10.6-31.2C357.9 52.5 340.5 43.2 321.5 43.2H190.5c-19 0-36.4 9.3-45.2 24.8zM256 336c44.2 0 80-35.8 80-80s-35.8-80-80-80s-80 35.8-80 80s35.8 80 80 80z',
  lock: 'M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-16 0H64v-72c0-53 43-96 96-96s96 43 96 96v72zm48 272H64V288h320v160zM224 304c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48z',
  rocket: 'M183.7 49.1C168.8 38.4 149 32 128.5 32c-37.9 0-71.8 21.8-88.1 54.8C25.7 120 16 155.6 16 192c0 45.1 19.7 84.2 48.9 110.8c12.1 11 25.5 20.5 40 28.4l-8.7 34.8c-1.3 5.1 2.1 10.3 7.2 11.6l45.7 11.4c5.1 1.3 10.3-2.1 11.6-7.2l8.9-35.7c8.2 1.8 16.7 2.9 25.3 2.9s17.1-1 25.3-2.9l8.9 35.7c1.3 5.1 6.5 8.5 11.6 7.2l45.7-11.4c5.1-1.3 8.5-6.5 7.2-11.6l-8.7-34.8c14.5-7.9 27.9-17.4 40-28.4C476.3 276.2 496 237.1 496 192c0-36.4-9.7-72-24.4-105.2C455.3 53.8 421.4 32 383.5 32c-20.5 0-40.3 6.4-55.2 17.1L272 60.2 240 82.8 183.7 49.1zM464 336c0 17.7-14.3 32-32 32h-16l-32 96H160l-32-96H48c-17.7 0-32-14.3-32-32c0-8.8 3.6-16.8 9.4-22.5L112 242.5V208c0-26.5 21.5-48 48-48h16V128c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32v32h16c26.5 0 48 21.5 48 48v34.5l94.6 71.5c5.8 5.7 9.4 13.7 9.4 22.5z',
  megaphone: 'M480 48c0-26.5-21.5-48-48-48H192c-26.5 0-48 21.5-48 48v96c0 26.5 21.5 48 48 48H432c26.5 0 48-21.5 48-48V48zM224 256c-35.3 0-64 28.7-64 64v32H32c-17.7 0-32 14.3-32 32v32c0 17.7 14.3 32 32 32H160V512h64V288c0-17.7 14.3-32 32-32h96c17.7 0 32 14.3 32 32V512h64V384c0-17.7-14.3-32-32-32H320V320c0-35.3-28.7-64-64-64zm32 32h32c17.7 0 32 14.3 32 32v32H288V288h32z',
};

const getIconPath = (type: string): string => {
  return ICON_PATHS[type] || 'M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z';
};

type FieldType = 'text' | 'url' | 'textarea' | 'image' | 'color' | 'toggle' | 'font' | 'spacing' | 'list' | 'align' | 'select';

interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  hint?: string;
  options?: { value: string; label: string }[];
}

const SECTIONS: Record<string, FieldDef[]> = {
  'Links Rápidos (Ajuda)': [
    { key: 'quicklinks_bg_color', label: 'Cor de Fundo da Seção', type: 'color' },
    { key: 'quicklinks_title', label: 'Título Principal', type: 'text', hint: 'Padrão: Como podemos te ajudar hoje?' },
  ],
  'Benefícios': [
    { key: 'benefits_bg_color', label: 'Cor de Fundo da Seção', type: 'color' },
    { key: 'benefits_title', label: 'Título Principal', type: 'text', hint: 'Padrão: Benefícios e vantagens de ser cliente Mundonet' },
  ],
  'Aplicativo Móvel': [
    { key: 'app_bg_color', label: 'Cor de Fundo da Seção', type: 'color' },
    { key: 'app_subtitle', label: 'Subtítulo', type: 'text', hint: 'Padrão: Aplicativo Móvel' },
    { key: 'app_subtitle_align', label: 'Alinhamento', type: 'align' },
    { key: 'app_title', label: 'Título Principal', type: 'text', hint: 'Padrão: O app que conecta você a tudo da Mundonet' },
    { key: 'app_title_align', label: 'Alinhamento', type: 'align' },
    { key: 'app_desc', label: 'Texto Descritivo', type: 'textarea' },
    { key: 'app_desc_align', label: 'Alinhamento', type: 'align' },
    { key: 'app_bullets', label: 'Benefícios (um por linha)', type: 'list' },
    { key: 'app_playstore_image', label: 'Imagem Botão Google Play', type: 'image' },
    { key: 'app_playstore', label: 'Link Google Play', type: 'url' },
    { key: 'app_appstore_image', label: 'Imagem Botão App Store', type: 'image' },
    { key: 'app_appstore', label: 'Link App Store', type: 'url' },
    { key: 'app_image', label: 'Imagem de Destaque', type: 'image' },
    { key: 'app_image_size', label: 'Tamanho da Imagem', type: 'spacing', hint: 'Ex: 100%, 80%, 500px' },
  ],
  'Especialidades': [
    { key: 'corp_bg_color', label: 'Cor de Fundo da Seção (Link Dedicado)', type: 'color' },
    { key: 'corp_subtitle', label: 'Subtítulo Link Dedicado', type: 'text', hint: 'Padrão: Soluções Corporativas' },
    { key: 'corp_subtitle_align', label: 'Alinhamento do Subtítulo', type: 'align' },
    { key: 'corp_title', label: 'Título Link Dedicado', type: 'text', hint: 'Padrão: Link Dedicado para sua Empresa' },
    { key: 'corp_title_align', label: 'Alinhamento do Título', type: 'align' },
    { key: 'corp_desc', label: 'Descrição Link Dedicado', type: 'textarea' },
    { key: 'corp_desc_align', label: 'Alinhamento da Descrição', type: 'align' },
    { key: 'corp_feat1_icon', label: 'Ícone Benefício 1 (SVG ou Emoji)', type: 'textarea', hint: 'Cole um código <svg> ou um emoji.' },
    { key: 'corp_feat1_title', label: 'Título Benefício 1', type: 'text' },
    { key: 'corp_feat1_desc', label: 'Descrição Benefício 1', type: 'text' },
    { key: 'corp_feat2_icon', label: 'Ícone Benefício 2 (SVG ou Emoji)', type: 'textarea', hint: 'Cole um código <svg> ou um emoji.' },
    { key: 'corp_feat2_title', label: 'Título Benefício 2', type: 'text' },
    { key: 'corp_feat2_desc', label: 'Descrição Benefício 2', type: 'text' },
    { key: 'corp_speed_val', label: 'Valor Gráfico', type: 'text', hint: 'Padrão: 100%' },
    { key: 'corp_speed_lbl', label: 'Rótulo Gráfico', type: 'text', hint: 'Padrão: Disponibilidade' },
    { key: 'corp_speed_desc', label: 'Texto do Gráfico', type: 'text' },
    { key: 'corp_btn_text', label: 'Texto do Botão Link Dedicado', type: 'text' },
    { key: 'corp_btn_link', label: 'Link do Botão Link Dedicado', type: 'url' },
    { key: 'wifi_bg_color', label: 'Cor de Fundo da Seção (Wi-Fi 6)', type: 'color' },
    { key: 'wifi_subtitle', label: 'Subtítulo Wi-Fi 6', type: 'text', hint: 'Padrão: Ultra Wi-Fi 6' },
    { key: 'wifi_subtitle_align', label: 'Alinhamento do Subtítulo Wi-Fi 6', type: 'align' },
    { key: 'wifi_title', label: 'Título Wi-Fi 6', type: 'text', hint: 'Padrão: Experimente o máximo desempenho com nossos equipamentos' },
    { key: 'wifi_title_align', label: 'Alinhamento do Título Wi-Fi 6', type: 'align' },
    { key: 'wifi_desc', label: 'Descrição Wi-Fi 6', type: 'textarea' },
    { key: 'wifi_desc_align', label: 'Alinhamento da Descrição Wi-Fi 6', type: 'align' },
    { key: 'wifi_feat1_icon', label: 'Ícone Benefício 1 Wi-Fi 6 (SVG/Emoji)', type: 'textarea' },
    { key: 'wifi_feat1_title', label: 'Título Benefício 1 Wi-Fi 6', type: 'text' },
    { key: 'wifi_feat1_desc', label: 'Descrição Benefício 1 Wi-Fi 6', type: 'text' },
    { key: 'wifi_feat2_icon', label: 'Ícone Benefício 2 Wi-Fi 6 (SVG/Emoji)', type: 'textarea' },
    { key: 'wifi_feat2_title', label: 'Título Benefício 2 Wi-Fi 6', type: 'text' },
    { key: 'wifi_feat2_desc', label: 'Descrição Benefício 2 Wi-Fi 6', type: 'text' },
    { key: 'wifi_feat3_icon', label: 'Ícone Benefício 3 Wi-Fi 6 (SVG/Emoji)', type: 'textarea' },
    { key: 'wifi_feat3_title', label: 'Título Benefício 3 Wi-Fi 6', type: 'text' },
    { key: 'wifi_feat3_desc', label: 'Descrição Benefício 3 Wi-Fi 6', type: 'text' },
    { key: 'wifi_btn_text', label: 'Texto do Botão Wi-Fi 6', type: 'text' },
    { key: 'wifi_btn_link', label: 'Link do Botão Wi-Fi 6', type: 'url' },
    { key: 'wifi_image', label: 'Imagem do Roteador', type: 'image' },
  ],
  'Entretenimento': [
    { key: 'ent_subtitle', label: 'Subtítulo', type: 'text', hint: 'Aplicativos para diversão...' },
    { key: 'ent_subtitle_align', label: 'Alinhamento do Subtítulo', type: 'align' },
    { key: 'ent_subtitle_font_size', label: 'Tamanho do Subtítulo', type: 'spacing', hint: 'Ex: 0.95rem, 16px' },
    { key: 'ent_title', label: 'Título Principal', type: 'text', hint: 'Aplicativos de entretenimento que traz...' },
    { key: 'ent_title_align', label: 'Alinhamento do Título', type: 'align' },
    { key: 'ent_title_font_size', label: 'Tamanho do Título', type: 'spacing', hint: 'Ex: 28px, 2rem' },
    { key: 'ent_title_font', label: 'Fonte do Título', type: 'font', hint: 'Google Fonts, ex: Poppins. Vazio = padrão.' },
    { key: 'ent_bottom_text', label: 'Texto inferior (acima do botão)', type: 'text', hint: 'Fale com nosso time e consulte...' },
    { key: 'ent_bottom_align', label: 'Alinhamento do Texto Inferior', type: 'align' },
    { key: 'ent_bottom_font_size', label: 'Tamanho do Texto Inferior', type: 'spacing', hint: 'Ex: 0.92rem, 14px' },
    { key: 'ent_btn_text', label: 'Texto do Botão', type: 'text', hint: 'Fale com nosso time' },
    { key: 'ent_btn_bg', label: 'Cor de Fundo do Botão', type: 'color', hint: 'Padrão: #6d28d9' },
    { key: 'ent_btn_text_color', label: 'Cor do Texto do Botão', type: 'color', hint: 'Padrão: #ffffff' },
    { key: 'ent_btn_font_size', label: 'Tamanho do Botão', type: 'spacing', hint: 'Ex: 0.95rem, 16px' },
    { key: 'ent_btn_link', label: 'Link do Botão', type: 'url', hint: 'Ex: https://api.whatsapp.com/...' },
    { key: 'ent_bg_color', label: 'Cor de Fundo da Seção', type: 'color', hint: 'Padrão: #f8fafc' },
    { key: 'ent_text_color', label: 'Cor do Texto', type: 'color', hint: 'Padrão: #1e293b' },
    { key: 'ent_carousel_bg', label: 'Cor de Fundo do Carrossel', type: 'color', hint: 'Padrão: #ffffff' },
  ],
  'Planos': [
    { key: 'plans_bg_color', label: 'Cor de Fundo da Seção', type: 'color' },
    { key: 'plans_eyebrow_color', label: 'Cor do Subtítulo ("Nossos Planos")', type: 'color', hint: 'Padrão: #7c3aed' },
    { key: 'plans_eyebrow_bg', label: 'Fundo do Subtítulo ("Nossos Planos")', type: 'color', hint: 'Padrão: #f3e8ff' },
    { key: 'plans_title_color', label: 'Cor do Título Principal', type: 'color', hint: 'Padrão: #1e1b4b' },
    { key: 'plans_arrow_color', label: 'Cor das Setas do Carrossel', type: 'color', hint: 'Padrão: #7c3aed' },
    { key: 'plans_arrow_bg', label: 'Fundo das Setas do Carrossel', type: 'color', hint: 'Padrão: #f3e8ff' },
    { key: 'plans_arrow_border', label: 'Borda das Setas do Carrossel', type: 'color', hint: 'Padrão: #e9d5ff' },
    { key: 'plans_dots_color', label: 'Cor dos Pontos do Carrossel', type: 'color', hint: 'Padrão: #7c3aed' },
  ],
  'Popup de Saída': [
    { key: 'exit_popup_enabled', label: 'Popup Ativo', type: 'toggle' },
    { key: 'exit_popup_title', label: 'Título do Popup', type: 'text', hint: 'Padrão: Ainda está aí?' },
    { key: 'exit_popup_subtitle', label: 'Subtítulo', type: 'text', hint: 'Padrão: Entre em contato e contrate com a gente de forma simples e segura!' },
    { key: 'exit_popup_bg_color', label: 'Cor de Fundo', type: 'color', hint: 'Padrão: #1a1028' },
    { key: 'exit_popup_text_color', label: 'Cor do Texto', type: 'color', hint: 'Padrão: #a1a1aa' },
    { key: 'exit_popup_title_color', label: 'Cor do Título', type: 'color', hint: 'Padrão: #ffffff' },
    { key: 'exit_popup_accent_color', label: 'Cor de Destaque (Ícones e Links)', type: 'color', hint: 'Padrão: #a855f7' },
    { key: 'exit_popup_card_bg', label: 'Cor de Fundo dos Cards', type: 'color', hint: 'Padrão: #2a1f3d' },
    { key: 'exit_popup_card_border', label: 'Cor da Borda dos Cards', type: 'color', hint: 'Padrão: rgba(255,255,255,0.08)' },
    { key: 'exit_popup_overlay_color', label: 'Cor do Overlay (fundo escurecido)', type: 'color', hint: 'Padrão: rgba(0,0,0,0.6)' },
  ],
  'Botão WhatsApp': [
    { key: 'wa_btn_link', label: 'Link do WhatsApp', type: 'url', hint: 'Ex: https://api.whatsapp.com/send?phone=55...' },
    { key: 'wa_btn_image', label: 'Imagem do Botão (URL ou upload)', type: 'image', hint: 'Deixe vazio para usar o ícone padrão do WhatsApp' },
    { key: 'wa_btn_size', label: 'Tamanho do Botão (px)', type: 'spacing', hint: 'Padrão: 60px' },
    { key: 'wa_btn_color', label: 'Cor de Fundo do Botão', type: 'color', hint: 'Padrão: #25D366' },
    { key: 'wa_btn_icon_color', label: 'Cor do Ícone/Imagem', type: 'color', hint: 'Padrão: #ffffff' },
    { key: 'wa_btn_shadow', label: 'Cor da Sombra', type: 'color', hint: 'Padrão: rgba(37,211,102,0.4)' },
    { key: 'wa_bubble_text', label: 'Texto do Balão', type: 'text', hint: 'Ex: Olá! Precisa de ajuda?' },
    { key: 'wa_bubble_bg', label: 'Cor de Fundo do Balão', type: 'color', hint: 'Padrão: #ffffff' },
    { key: 'wa_bubble_color', label: 'Cor do Texto do Balão', type: 'color', hint: 'Padrão: #333333' },
    { key: 'wa_bubble_font_size', label: 'Tamanho da Fonte do Balão', type: 'spacing', hint: 'Padrão: 14px' },
  ],
  'Banner CTA': [
    { key: 'cta_section_bg_color', label: 'Cor de Fundo da Seção', type: 'color', hint: 'Padrão: transparente' },
    { key: 'cta_bg_image', label: 'Imagem de Fundo do Banner', type: 'image', hint: 'Imagem de fundo do banner' },
    { key: 'cta_bg_color', label: 'Cor de Fundo do Banner', type: 'color', hint: 'Padrão: #1a0a2e' },
    { key: 'cta_title', label: 'Título', type: 'text', hint: 'Procurando um plano para sua empresa?' },
    { key: 'cta_desc', label: 'Descrição', type: 'text', hint: 'Planos de internet para empresas...' },
    { key: 'cta_text_color', label: 'Cor do Título', type: 'color', hint: 'Padrão: #ffffff' },
    { key: 'cta_desc_color', label: 'Cor da Descrição', type: 'color', hint: 'Padrão: #d1d5db' },
    { key: 'cta_content_position', label: 'Posição do Conteúdo', type: 'select', hint: 'left', options: [
      { value: 'left', label: 'Esquerda' },
      { value: 'center', label: 'Centro' },
      { value: 'right', label: 'Direita' },
    ]},
    { key: 'cta_btn_text', label: 'Texto do Botão', type: 'text', hint: 'Conheça nossas soluções' },
    { key: 'cta_btn_link', label: 'Link do Botão', type: 'url' },
    { key: 'cta_btn_bg', label: 'Cor de Fundo do Botão', type: 'color', hint: 'Padrão: #ffffff' },
    { key: 'cta_btn_color', label: 'Cor do Texto do Botão', type: 'color', hint: 'Padrão: #7c3aed' },
  ],
  'Central de Atendimento': [],
};

const SECTION_DEFS = [
  { id: 'hero', label: 'Banner (Hero)', icon: '🖼️' },
  { id: 'quicklinks', label: 'Links Rápidos', icon: '🔗' },
  { id: 'plans', label: 'Planos', icon: '📦' },
  { id: 'benefits', label: 'Benefícios', icon: '⭐' },
  { id: 'app', label: 'Aplicativo Móvel', icon: '📱' },
  { id: 'specialties', label: 'Especialidades (Wi-Fi 6 + Link Dedicado)', icon: '📶' },
  { id: 'entertainment', label: 'Entretenimento', icon: '🎬' },
  { id: 'cta', label: 'Banner CTA', icon: '🎯' },
  { id: 'support', label: 'Central de Atendimento', icon: '💬' },
  { id: 'contact', label: 'Contato', icon: '📞' },
];

const DEFAULT_ORDER = SECTION_DEFS.map(s => s.id);
const DEFAULT_ACTIVE: Record<string, boolean> = Object.fromEntries(SECTION_DEFS.map(s => [s.id, true]));

export const ManageHomeSections = () => {
  const [settings, setSettings] = useState<Record<string, Setting>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [activeTab, setActiveTab] = useState<string>(Object.keys(SECTIONS)[0]);
  const [sectionOrder, setSectionOrder] = useState<string[]>(DEFAULT_ORDER);
  const [sectionsActive, setSectionsActive] = useState<Record<string, boolean>>({ ...DEFAULT_ACTIVE });
  const [sectionsMobile, setSectionsMobile] = useState<Record<string, boolean>>({ ...DEFAULT_ACTIVE });
  const [popupCards, setPopupCards] = useState<{ id: number; title: string; description: string; link: string; icon_type: string }[]>([]);

  const load = async () => {
    try {
      const data: Record<string, { value: string; label: string }> = await apiFetch('/settings');
      const map: Record<string, Setting> = {};
      for (const [key, obj] of Object.entries(data)) {
        map[key] = { key, value: obj.value, label: obj.label };
      }
      setSettings(map);
      if (data.sections_order?.value) {
        try {
          const parsed = JSON.parse(data.sections_order.value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const merged = [...parsed];
            for (const id of DEFAULT_ORDER) {
              if (!merged.includes(id)) merged.push(id);
            }
            setSectionOrder(merged);
          }
        } catch { /* use default */ }
      }
      if (data.sections_active?.value) {
        try {
          const parsed = JSON.parse(data.sections_active.value);
          if (typeof parsed === 'object' && parsed !== null) setSectionsActive({ ...DEFAULT_ACTIVE, ...parsed });
        } catch { /* use default */ }
      }
      if (data.sections_mobile_active?.value) {
        try {
          const parsed = JSON.parse(data.sections_mobile_active.value);
          if (typeof parsed === 'object' && parsed !== null) setSectionsMobile({ ...DEFAULT_ACTIVE, ...parsed });
        } catch { /* use default */ }
      }
      if (data.exit_popup_cards?.value) {
        try {
          const parsed = JSON.parse(data.exit_popup_cards.value);
          if (Array.isArray(parsed)) setPopupCards(parsed);
        } catch { /* use default */ }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { load(); }, []);

  const moveSection = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sectionOrder.length) return;
    const next = [...sectionOrder];
    [next[index], next[target]] = [next[target], next[index]];
    setSectionOrder(next);
  };

  const toggleActive = (id: string) => {
    setSectionsActive(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const saveOrder = async () => {
    setSaving(true);
    try {
      await Promise.all([
        apiFetch('/settings/sections_order', {
          method: 'PUT',
          body: JSON.stringify({ value: JSON.stringify(sectionOrder), label: 'Ordem das Seções' })
        }),
        apiFetch('/settings/sections_active', {
          method: 'PUT',
          body: JSON.stringify({ value: JSON.stringify(sectionsActive), label: 'Seções Ativas' })
        }),
        apiFetch('/settings/sections_mobile_active', {
          method: 'PUT',
          body: JSON.stringify({ value: JSON.stringify(sectionsMobile), label: 'Seções Ativas no Mobile' })
        })
      ]);
      setMsg('Ordem, visibilidade e mobile salvos com sucesso!');
      setTimeout(() => setMsg(''), 3000);
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const set = (key: string, value: string, label: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: { key, value, label }
    }));
  };

  const handleImageUpload = async (file: File, key: string, label: string) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const token = localStorage.getItem('mundonet_token');
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.url) set(key, data.url, label);
    } catch (e) {
      console.error('Erro no upload', e);
      alert('Erro no upload da imagem.');
    }
  };

  const save = async () => {
    setSaving(true);
    setMsg('');
    try {
      const updates = Object.values(settings);
      await Promise.all(
        updates.map(s => 
          apiFetch(`/settings/${s.key}`, {
            method: 'PUT',
            body: JSON.stringify({ value: s.value, label: s.label })
          })
        )
      );
      setMsg('Configurações salvas com sucesso!');
      setTimeout(() => setMsg(''), 3000);
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const renderField = (fd: FieldDef) => {
    const val = settings[fd.key]?.value || '';

    switch (fd.type) {
      case 'textarea':
        const alignKey = fd.key + '_align';
        const currentAlign = settings[alignKey]?.value || 'left';
        return (
          <div className="admin-field" key={fd.key} style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ margin: 0 }}>{fd.label}</label>
              <div style={{ display: 'flex', gap: 2 }}>
                {[
                  { v: 'left', icon: '⫷', title: 'Esquerda' },
                  { v: 'center', icon: '☰', title: 'Centralizado' },
                  { v: 'right', icon: '⫸', title: 'Direita' },
                  { v: 'justify', icon: '≡', title: 'Justificado' },
                ].map(a => (
                  <button
                    key={a.v}
                    className={`admin-btn ${currentAlign === a.v ? 'primary' : 'ghost'}`}
                    style={{ padding: '3px 8px', fontSize: 12, minWidth: 32 }}
                    title={a.title}
                    onClick={() => set(alignKey, a.v, fd.label + ' (Alinhamento)')}
                  >{a.icon}</button>
                ))}
              </div>
            </div>
            <RichTextField value={val} onChange={v => set(fd.key, v, fd.label)} placeholder={fd.hint} />
            {fd.hint && <small style={{ color: 'var(--adm-text2)', marginTop: 4, display: 'block' }}>{fd.hint}</small>}
          </div>
        );
      case 'image':
        return (
          <div className="admin-field" key={fd.key} style={{ gridColumn: '1 / -1' }}>
            <label>{fd.label}</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input value={val} onChange={e => set(fd.key, e.target.value, fd.label)} placeholder="https://..." style={{ flex: 1 }} />
              <label className="admin-btn ghost" style={{ cursor: 'pointer', margin: 0 }}>
                Upload
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageUpload(e.target.files[0], fd.key, fd.label);
                  }
                }} />
              </label>
            </div>
            {fd.hint && <small style={{ color: 'var(--adm-text2)', marginTop: 4, display: 'block' }}>{fd.hint}</small>}
            {val && (
              <div style={{ marginTop: 10, padding: 10, background: 'var(--adm-bg)', borderRadius: 8, display: 'inline-block' }}>
                <img src={val} alt="Preview" style={{ maxHeight: 150, maxWidth: '100%', objectFit: 'contain' }} />
              </div>
            )}
          </div>
        );
      case 'color':
        return (
          <div className="admin-field" key={fd.key}>
            <label>{fd.label}</label>
            <ColorPicker value={val || '#000000'} onChange={v => set(fd.key, v, fd.label)} />
            {fd.hint && <small style={{ color: 'var(--adm-text2)', marginTop: 4, display: 'block' }}>{fd.hint}</small>}
          </div>
        );
      case 'toggle':
        const isActive = val === 'true' || val === '' || val === undefined;
        return (
          <div className="admin-field" key={fd.key}>
            <label>{fd.label}</label>
            <ToggleSwitch
              value={isActive}
              onChange={v => set(fd.key, v ? 'true' : 'false', fd.label)}
              label={isActive ? 'Ativo' : 'Inativo'}
            />
          </div>
        );
      case 'font':
        return (
          <div className="admin-field" key={fd.key}>
            <label>{fd.label}</label>
            <input value={val} onChange={e => set(fd.key, e.target.value, fd.label)} placeholder={fd.hint || 'Ex: Poppins, Inter...'} />
            {fd.hint && <small style={{ color: 'var(--adm-text2)', marginTop: 4, display: 'block' }}>{fd.hint}</small>}
            {val && <div style={{ marginTop: 6, padding: '8px 12px', background: 'var(--adm-bg)', borderRadius: 6, fontFamily: val, fontSize: '0.95rem', border: '1px dashed var(--adm-border)' }}>Preview: {val}</div>}
          </div>
        );
      case 'spacing':
        return (
          <div className="admin-field" key={fd.key}>
            <label>{fd.label}</label>
            <input value={val} onChange={e => set(fd.key, e.target.value, fd.label)} placeholder={fd.hint || 'Ex: 28px, 0.95rem, 16px'} />
            {fd.hint && <small style={{ color: 'var(--adm-text2)', marginTop: 4, display: 'block' }}>{fd.hint}</small>}
          </div>
        );
      case 'list':
        const listItems = val ? val.split('\n') : [];
        return (
          <div className="admin-field" key={fd.key} style={{ gridColumn: '1 / -1' }}>
            <label>{fd.label}</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {listItems.map((item: string, idx: number) => (
                <div key={idx} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ color: 'var(--adm-text2)', fontSize: 13, minWidth: 20 }}>{idx + 1}.</span>
                  <input
                    value={item}
                    onChange={e => {
                      const next = [...listItems];
                      next[idx] = e.target.value;
                      set(fd.key, next.join('\n'), fd.label);
                    }}
                    style={{ flex: 1, padding: '6px 10px', fontSize: 13 }}
                  />
                  <button
                    className="admin-btn ghost"
                    style={{ padding: '4px 8px', fontSize: 12, color: '#ef4444' }}
                    onClick={() => {
                      const next = listItems.filter((_: string, i: number) => i !== idx);
                      set(fd.key, next.join('\n'), fd.label);
                    }}
                  >×</button>
                </div>
              ))}
              <button
                className="admin-btn ghost"
                style={{ fontSize: 13, alignSelf: 'flex-start' }}
                onClick={() => set(fd.key, listItems.concat(['']).join('\n'), fd.label)}
              >+ Adicionar Benefício</button>
            </div>
          </div>
        );
      case 'align':
        return (
          <div className="admin-field" key={fd.key}>
            <label>{fd.label}</label>
            <div style={{ display: 'flex', gap: 4 }}>
              {[
                { v: 'left', icon: '⫷', title: 'Esquerda' },
                { v: 'center', icon: '☰', title: 'Centralizado' },
                { v: 'right', icon: '⫸', title: 'Direita' },
                { v: 'justify', icon: '≡', title: 'Justificado' },
              ].map(a => (
                <button
                  key={a.v}
                  className={`admin-btn ${val === a.v ? 'primary' : 'ghost'}`}
                  style={{ padding: '6px 12px', fontSize: 14, minWidth: 42 }}
                  title={a.title}
                  onClick={() => set(fd.key, a.v, fd.label)}
                >{a.icon}</button>
              ))}
            </div>
          </div>
        );
      case 'select':
        return (
          <div className="admin-field" key={fd.key}>
            <label>{fd.label}</label>
            <select
              value={val || fd.hint || ''}
              onChange={e => set(fd.key, e.target.value, fd.label)}
              style={{ padding: '6px 10px', fontSize: 13 }}
            >
              {fd.options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        );
      default:
        return (
          <div className="admin-field" key={fd.key}>
            <label>{fd.label}</label>
            <input type={fd.type} value={val} onChange={e => set(fd.key, e.target.value, fd.label)} placeholder={fd.hint} />
            {fd.hint && <small style={{ color: 'var(--adm-text2)', marginTop: 4, display: 'block' }}>{fd.hint}</small>}
          </div>
        );
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2>Seções da Home</h2>
          <p>Personalize os textos, imagens e benefícios apresentados nas seções da página inicial.</p>
        </div>
        {activeTab !== 'Links Rápidos (Ajuda)' && activeTab !== 'Benefícios' && (
          <button className="admin-btn primary" onClick={save} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        )}
      </div>

      {msg && <div className={`admin-alert ${msg.includes('Erro') ? 'red' : 'success'}`}>{msg}</div>}

      <div className="admin-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Ordem das Seções</h3>
          <button className="admin-btn primary" onClick={saveOrder} disabled={saving} style={{ fontSize: 13 }}>
            {saving ? 'Salvando...' : 'Salvar Ordem e Visibilidade'}
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {sectionOrder.map((id, i) => {
            const def = SECTION_DEFS.find(s => s.id === id);
            const active = sectionsActive[id] !== false;
            return (
              <div key={id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', background: 'var(--adm-bg)', borderRadius: 8,
                border: '1px solid var(--adm-border)', opacity: active ? 1 : 0.5
              }}>
                <span style={{ fontSize: 18 }}>{def?.icon || '?'}</span>
                <span style={{ flex: 1 }}>{def?.label || id}</span>
                <ToggleSwitch value={active} onChange={() => toggleActive(id)} />
                <label style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer', fontSize:13, color: sectionsMobile[id] !== false ? 'var(--adm-success)' : 'var(--adm-text2)' }}
                  title={sectionsMobile[id] !== false ? 'Visível no mobile' : 'Oculto no mobile'}
                  onClick={() => setSectionsMobile(prev => ({ ...prev, [id]: prev[id] === false ? true : false }))}>
                  📱 {sectionsMobile[id] !== false ? 'Sim' : 'Não'}
                </label>
                <button className="admin-btn ghost" style={{ padding: '4px 8px', fontSize: 13, lineHeight: 1 }}
                  disabled={i === 0} onClick={() => moveSection(i, -1)} title="Mover para cima">▲</button>
                <button className="admin-btn ghost" style={{ padding: '4px 8px', fontSize: 13, lineHeight: 1 }}
                  disabled={i === sectionOrder.length - 1} onClick={() => moveSection(i, 1)} title="Mover para baixo">▼</button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="admin-tabs" style={{ marginBottom: 20 }}>
        {Object.keys(SECTIONS).map(tab => (
          <button 
            key={tab} 
            className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Toggle de ativar/desativar seção */}
      <div className="admin-card" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Seção {activeTab}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: sectionsActive[Object.keys(SECTIONS).find(k => k === activeTab) || ''] !== false ? 'var(--adm-green)' : 'var(--adm-text2)', fontWeight: 500, fontSize: 13 }}>
            {sectionsActive[Object.keys(SECTIONS).find(k => k === activeTab) || ''] !== false ? 'Visível no site' : 'Oculta no site'}
          </span>
          <ToggleSwitch
            value={sectionsActive[sectionOrder.find(id => SECTION_DEFS.find(s => s.id === id)?.label === activeTab) || ''] !== false}
            onChange={async () => {
              const tabId = sectionOrder.find(id => SECTION_DEFS.find(s => s.id === id)?.label === activeTab);
              if (tabId) {
                const nextActive = { ...sectionsActive, [tabId]: sectionsActive[tabId] === false ? true : false };
                setSectionsActive(nextActive);
                try {
                  await apiFetch('/settings/sections_active', {
                    method: 'PUT',
                    body: JSON.stringify({ value: JSON.stringify(nextActive), label: 'Seções Ativas' })
                  });
                } catch (e) { console.error(e); }
              }
            }}
          />
        </div>
      </div>

      {activeTab === 'Links Rápidos (Ajuda)' ? (
        <>
          <div className="admin-card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid var(--adm-border)' }}>
              Texto da Seção
            </h3>
            <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {SECTIONS[activeTab].map(renderField)}
            </div>
            <div style={{ marginTop: 16 }}>
              <button className="admin-btn primary" onClick={save} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar Texto'}
              </button>
            </div>
          </div>
          <ManageQuickLinks />
        </>
      ) : activeTab === 'Benefícios' ? (
        <>
          <div className="admin-card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid var(--adm-border)' }}>
              Texto da Seção
            </h3>
            <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {SECTIONS[activeTab].map(renderField)}
            </div>
            <div style={{ marginTop: 16 }}>
              <button className="admin-btn primary" onClick={save} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar Texto'}
              </button>
            </div>
          </div>
          <ManageBenefits />
        </>
      ) : activeTab === 'Popup de Saída' ? (
        <>
          <div className="admin-card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid var(--adm-border)' }}>
              Texto e Cores
            </h3>
            <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {SECTIONS[activeTab].map(renderField)}
            </div>
          </div>
          <div className="admin-card">
            <h3 style={{ marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid var(--adm-border)' }}>
              Opções de Contato (Cards)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {popupCards.map((card, i) => (
                <div key={card.id} style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, alignItems: 'start',
                  padding: '12px', background: 'var(--adm-bg)', borderRadius: 8, border: '1px solid var(--adm-border)'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <input value={card.title} placeholder="Título" onChange={e => {
                      const next = [...popupCards]; next[i] = { ...card, title: e.target.value }; setPopupCards(next);
                    }} style={{ padding: '6px 10px', fontSize: 13 }} />
                    <input value={card.description} placeholder="Descrição" onChange={e => {
                      const next = [...popupCards]; next[i] = { ...card, description: e.target.value }; setPopupCards(next);
                    }} style={{ padding: '6px 10px', fontSize: 13 }} />
                    <div style={{
                      display: 'flex', flexWrap: 'wrap', gap: 6, padding: '8px',
                      background: 'var(--adm-bg)', borderRadius: 6, border: '1px solid var(--adm-border)'
                    }}>
                      {EXIT_ICON_OPTIONS.map(icon => (
                        <button
                          key={icon.value}
                          title={icon.label}
                          onClick={() => {
                            const next = [...popupCards]; next[i] = { ...card, icon_type: icon.value }; setPopupCards(next);
                          }}
                          style={{
                            width: 36, height: 36,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: 6, border: card.icon_type === icon.value ? '2px solid var(--adm-accent)' : '1px solid var(--adm-border)',
                            background: card.icon_type === icon.value ? 'var(--adm-accent)' : 'transparent',
                            cursor: 'pointer', padding: 0, transition: 'all 0.15s'
                          }}
                        >
                          <svg viewBox="0 0 512 512" style={{
                            width: 18, height: 18,
                            fill: card.icon_type === icon.value ? '#ffffff' : 'var(--adm-text2)'
                          }}>
                            {getIconPath(icon.value)}
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  <button className="admin-btn ghost" style={{ padding: '4px 8px', fontSize: 12, color: '#ef4444', alignSelf: 'start', marginTop: 4 }}
                    onClick={() => setPopupCards(popupCards.filter((_, j) => j !== i))}>Remover</button>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="admin-btn ghost" onClick={() => setPopupCards([...popupCards, {
                  id: Date.now(), title: '', description: '', link: '#', icon_type: 'whatsapp'
                }])} style={{ fontSize: 13 }}>+ Adicionar Card</button>
              </div>
              {popupCards.map((card, i) => (
                <div key={`link-${card.id}`} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'center' }}>
                  <input value={card.link} placeholder="Link (https://... ou tel:... ou mailto:...)" onChange={e => {
                    const next = [...popupCards]; next[i] = { ...card, link: e.target.value }; setPopupCards(next);
                  }} style={{ padding: '6px 10px', fontSize: 13 }} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <button className="admin-btn primary" onClick={async () => {
                await save();
                await apiFetch('/settings/exit_popup_cards', {
                  method: 'PUT',
                  body: JSON.stringify({ value: JSON.stringify(popupCards), label: 'Cards do Popup de Saída' })
                });
              }} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar Popup de Saída'}
              </button>
            </div>
          </div>
        </>
      ) : activeTab === 'Central de Atendimento' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Header: Cores */}
          <div className="admin-card">
            <h3 style={{ margin: '0 0 16px', paddingBottom: 10, borderBottom: '1px solid var(--adm-border)', fontSize: 15 }}>🎨 Aparência</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
              {[
                { key: 'support_bg_color', label: 'Fundo da Seção', hint: '#f5f0ff' },
                { key: 'support_title_color', label: 'Cor dos Títulos', hint: '#1e1b4b' },
                { key: 'support_desc_color', label: 'Cor das Descrições', hint: '#64748b' },
                { key: 'support_card_bg', label: 'Fundo dos Cards', hint: '#ffffff' },
              ].map(fd => {
                const val = settings[fd.key]?.value || '';
                return (
                  <div key={fd.key}>
                    <label style={{ fontSize: 12, color: 'var(--adm-text2)', marginBottom: 4, display: 'block' }}>{fd.label}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="color" value={val || '#000000'} onChange={e => set(fd.key, e.target.value, fd.label)}
                        style={{ width: 36, height: 32, padding: 0, border: '1px solid var(--adm-border)', borderRadius: 6, cursor: 'pointer', background: 'none' }} />
                      <input type="text" value={val} onChange={e => set(fd.key, e.target.value, fd.label)} placeholder={fd.hint}
                        style={{ flex: 1, fontFamily: 'monospace', fontSize: 12, padding: '4px 8px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lado a lado: Esquerda / Direita */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Coluna Esquerda */}
            <div className="admin-card">
              <h3 style={{ margin: '0 0 16px', paddingBottom: 10, borderBottom: '1px solid var(--adm-border)', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: 'var(--adm-accent)', color: '#fff', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>ESQUERDA</span>
                Sobre a Empresa
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--adm-text2)', marginBottom: 4, display: 'block' }}>Título</label>
                  <input value={settings.support_left_title?.value || ''} onChange={e => set('support_left_title', e.target.value, 'Título')}
                    placeholder="Somos a Mundonet" style={{ width: '100%', padding: '8px 10px', fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--adm-text2)', marginBottom: 4, display: 'block' }}>Descrição</label>
                  <textarea value={settings.support_left_desc?.value || ''} onChange={e => set('support_left_desc', e.target.value, 'Descrição')}
                    placeholder="Texto institucional..." rows={4} style={{ width: '100%', padding: '8px 10px', fontSize: 13, resize: 'vertical' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--adm-text2)', marginBottom: 4, display: 'block' }}>Texto Destaque</label>
                  <input value={settings.support_left_highlight?.value || ''} onChange={e => set('support_left_highlight', e.target.value, 'Texto Destaque')}
                    placeholder="Faça parte deste movimento." style={{ width: '100%', padding: '8px 10px', fontSize: 14 }} />
                </div>
                <div style={{ background: 'var(--adm-bg)', borderRadius: 8, padding: 12, border: '1px solid var(--adm-border)' }}>
                  <label style={{ fontSize: 11, color: 'var(--adm-text2)', marginBottom: 8, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>Botão</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ fontSize: 11, color: 'var(--adm-text2)', marginBottom: 2, display: 'block' }}>Texto</label>
                      <input value={settings.support_left_btn_text?.value || ''} onChange={e => set('support_left_btn_text', e.target.value, 'Texto Botão')}
                        placeholder="Conheça mais" style={{ width: '100%', padding: '6px 8px', fontSize: 13 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: 'var(--adm-text2)', marginBottom: 2, display: 'block' }}>Link</label>
                      <input value={settings.support_left_btn_link?.value || ''} onChange={e => set('support_left_btn_link', e.target.value, 'Link Botão')}
                        placeholder="https://..." style={{ width: '100%', padding: '6px 8px', fontSize: 13 }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                    <label style={{ fontSize: 11, color: 'var(--adm-text2)' }}>Cor</label>
                    <input type="color" value={settings.support_left_btn_bg?.value || '#7c3aed'} onChange={e => set('support_left_btn_bg', e.target.value, 'Cor Botão')}
                      style={{ width: 32, height: 28, padding: 0, border: '1px solid var(--adm-border)', borderRadius: 4, cursor: 'pointer', background: 'none' }} />
                    <span style={{ fontSize: 11, color: 'var(--adm-text2)' }}>Texto</span>
                    <input type="color" value={settings.support_left_btn_color?.value || '#ffffff'} onChange={e => set('support_left_btn_color', e.target.value, 'Cor Texto Botão')}
                      style={{ width: 32, height: 28, padding: 0, border: '1px solid var(--adm-border)', borderRadius: 4, cursor: 'pointer', background: 'none' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="admin-card">
              <h3 style={{ margin: '0 0 16px', paddingBottom: 10, borderBottom: '1px solid var(--adm-border)', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: 'var(--adm-accent)', color: '#fff', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>DIREITA</span>
                Canais de Atendimento
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--adm-text2)', marginBottom: 4, display: 'block' }}>Título</label>
                  <input value={settings.support_right_title?.value || ''} onChange={e => set('support_right_title', e.target.value, 'Título Direita')}
                    placeholder="Canais de atendimento" style={{ width: '100%', padding: '8px 10px', fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--adm-text2)', marginBottom: 4, display: 'block' }}>Descrição</label>
                  <textarea value={settings.support_right_desc?.value || ''} onChange={e => set('support_right_desc', e.target.value, 'Descrição Direita')}
                    placeholder="Texto sobre canais..." rows={3} style={{ width: '100%', padding: '8px 10px', fontSize: 13, resize: 'vertical' }} />
                </div>

                {/* Canais */}
                {[
                  { prefix: 'ch1', label: 'Canal 1' },
                  { prefix: 'ch2', label: 'Canal 2' },
                ].map(ch => (
                  <div key={ch.prefix} style={{ background: 'var(--adm-bg)', borderRadius: 8, padding: 12, border: '1px solid var(--adm-border)' }}>
                    <label style={{ fontSize: 11, color: 'var(--adm-text2)', marginBottom: 8, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>{ch.label}</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div>
                        <label style={{ fontSize: 11, color: 'var(--adm-text2)', marginBottom: 2, display: 'block' }}>Valor</label>
                        <input value={settings[`support_${ch.prefix}_value`]?.value || ''} onChange={e => set(`support_${ch.prefix}_value`, e.target.value, `${ch.label} Valor`)}
                          placeholder="0800 765 5507" style={{ width: '100%', padding: '6px 8px', fontSize: 13 }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, color: 'var(--adm-text2)', marginBottom: 2, display: 'block' }}>Rótulo</label>
                        <input value={settings[`support_${ch.prefix}_label`]?.value || ''} onChange={e => set(`support_${ch.prefix}_label`, e.target.value, `${ch.label} Rótulo`)}
                          placeholder="Whatsapp e telefone" style={{ width: '100%', padding: '6px 8px', fontSize: 13 }} />
                      </div>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <label style={{ fontSize: 11, color: 'var(--adm-text2)', marginBottom: 2, display: 'block' }}>Link</label>
                      <input value={settings[`support_${ch.prefix}_link`]?.value || ''} onChange={e => set(`support_${ch.prefix}_link`, e.target.value, `${ch.label} Link`)}
                        placeholder="https://..." style={{ width: '100%', padding: '6px 8px', fontSize: 13 }} />
                    </div>
                  </div>
                ))}

                {/* Botões de ação */}
                <div style={{ background: 'var(--adm-bg)', borderRadius: 8, padding: 12, border: '1px solid var(--adm-border)' }}>
                  <label style={{ fontSize: 11, color: 'var(--adm-text2)', marginBottom: 8, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>Botões de Ação</label>
                  {[{ prefix: 'ch_btn1', label: 'Botão 1' }, { prefix: 'ch_btn2', label: 'Botão 2' }].map(btn => (
                    <div key={btn.prefix} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid var(--adm-border)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <div>
                          <label style={{ fontSize: 11, color: 'var(--adm-text2)', marginBottom: 2, display: 'block' }}>{btn.label} - Texto</label>
                          <input value={settings[`support_${btn.prefix}_text`]?.value || ''} onChange={e => set(`support_${btn.prefix}_text`, e.target.value, `${btn.label} Texto`)}
                            placeholder="Entre em contato" style={{ width: '100%', padding: '6px 8px', fontSize: 13 }} />
                        </div>
                        <div>
                          <label style={{ fontSize: 11, color: 'var(--adm-text2)', marginBottom: 2, display: 'block' }}>{btn.label} - Link</label>
                          <input value={settings[`support_${btn.prefix}_link`]?.value || ''} onChange={e => set(`support_${btn.prefix}_link`, e.target.value, `${btn.label} Link`)}
                            placeholder="https://..." style={{ width: '100%', padding: '6px 8px', fontSize: 13 }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                        <label style={{ fontSize: 11, color: 'var(--adm-text2)' }}>Fundo</label>
                        <input type="color" value={settings[`support_${btn.prefix}_bg`]?.value || '#7c3aed'} onChange={e => set(`support_${btn.prefix}_bg`, e.target.value, `${btn.label} Cor`)}
                          style={{ width: 28, height: 24, padding: 0, border: '1px solid var(--adm-border)', borderRadius: 4, cursor: 'pointer', background: 'none' }} />
                        <label style={{ fontSize: 11, color: 'var(--adm-text2)' }}>Texto</label>
                        <input type="color" value={settings[`support_${btn.prefix}_color`]?.value || '#ffffff'} onChange={e => set(`support_${btn.prefix}_color`, e.target.value, `${btn.label} Cor Texto`)}
                          style={{ width: 28, height: 24, padding: 0, border: '1px solid var(--adm-border)', borderRadius: 4, cursor: 'pointer', background: 'none' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="admin-btn primary" onClick={save} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Central de Atendimento'}
            </button>
          </div>
        </div>
      ) : (
        <div className="admin-card">
          <h3 style={{ marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid var(--adm-border)' }}>
            Editar {activeTab}
          </h3>
          <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {SECTIONS[activeTab].map(renderField)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageHomeSections;