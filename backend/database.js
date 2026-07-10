import { JSONFilePreset } from 'lowdb/node';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'data', 'mundonet-db.json');

// ── Estrutura padrão do banco ─────────────────────────────────────
const defaultData = {
  users: [],
  hero_slides: [],
  plans: [],
  quick_links: [],
  entertainment: [],
  contact_info: [],
  site_settings: [],
  app_library: [],
  benefits: [],
  file_uploads: [],
  badge_library: [],
  enterprise_plans: [],
  _counters: { users:0, hero:0, plans:0, ql:0, ent:0, app_lib:0, benefits:0, file_uploads:0, badge_library:0, enterprise_plans:0 }
};

let db;

export async function initDB() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  db = await JSONFilePreset(DB_PATH, defaultData);

  // ── Auto-increment helper ────────────────────────────────────────
  db.nextId = (table) => {
    const allItems = db.data[table] || [];
    if (allItems.length === 0) return 1;
    return Math.max(...allItems.map(i => i.id)) + 1;
  };

  // ── Seed: admin ──────────────────────────────────────────────────
  const adminUser = db.data.users.find(u => u.email === 'admin@mundonet.com.br');
  if (!adminUser) {
    db.data.users.push({
      id: db.nextId('users'),
      name: 'Administrador',
      email: 'admin@mundonet.com.br',
      password: bcrypt.hashSync('admin123', 10),
      created_at: new Date().toISOString()
    });
    console.log('✅ Admin criado: admin@mundonet.com.br / admin123');
  } else {
    // Garante que a senha seja sempre admin123 (útil quando o volume persiste)
    adminUser.password = bcrypt.hashSync('admin123', 10);
  }

  // ── Seed: hero_slides ────────────────────────────────────────────
  if (db.data.hero_slides.length === 0) {
    const slides = [
      { url:'https://mundonetbandalarga.com.br/wp-content/uploads/2026/06/area-top_700.png', title:'Internet 100% Fibra Óptica', subtitle:'Navegue na velocidade da luz com estabilidade garantida.' },
      { url:'https://mundonetbandalarga.com.br/wp-content/uploads/2026/06/globoplay1.png', title:'Planos com Streaming Inclusos', subtitle:'Assista seus filmes e séries favoritos sem interrupções.' },
      { url:'https://mundonetbandalarga.com.br/wp-content/uploads/2026/01/planogamer.png', title:'Plano Ultra Gamer', subtitle:'Baixo ping e máxima performance para vencer todas as partidas.' },
      { url:'https://mundonetbandalarga.com.br/wp-content/uploads/2026/06/banner_site_indique-e-ganhe2.png', title:'Indique e Ganhe Descontos', subtitle:'Compartilhe conexões de qualidade e ganhe bônus na sua mensalidade.' },
    ];
    slides.forEach((s, i) => db.data.hero_slides.push({ id: i+1, ...s, sort_order: i, active: true }));
  }

  // ── Seed: plans ──────────────────────────────────────────────────
  if (db.data.plans.length === 0) {
    const plans = [
      { name:'600 MEGA', speed:'600', price:'79,90', highlight:'Streaming e reuniões sem travar', highlight_icon:'📶', button_text:'EU QUERO!', whatsapp_msg:'Olá!%20Vim%20pelo%20site%20e%20gostaria%20de%20contratar%20o%20plano%20de%20600%20MEGA.', included_apps:[{name:'Wi-Fi 6',color:'#6B21A8',textColor:'#fff',abbr:'WiFi'},{name:'TV 40ch',color:'#1E40AF',textColor:'#fff',abbr:'TV'},{name:'E-Book',color:'#166534',textColor:'#fff',abbr:'Bk'},{name:'Filmes',color:'#B45309',textColor:'#fff',abbr:'Fil'}], bonus_app:{name:'Ilimitado',color:'#111827',textColor:'#fff',abbr:'∞'}, details:['Internet 100% Fibra Óptica','Wi-Fi 6 incluso','40 canais de TV grátis','Filmes e E-Books inclusos','Velocidade ilimitada','Instalação por R$ 39,90'], popular:false, active:true, sort_order:0 },
      { name:'700 MEGA', speed:'700', price:'89,90', highlight:'Vários dispositivos conectados', highlight_icon:'📡', button_text:'EU QUERO!', whatsapp_msg:'Olá!%20Vim%20pelo%20site%20e%20gostaria%20de%20contratar%20o%20plano%20de%20700%20MEGA.', included_apps:[{name:'Wi-Fi 6',color:'#6B21A8',textColor:'#fff',abbr:'WiFi'},{name:'TV 40ch',color:'#1E40AF',textColor:'#fff',abbr:'TV'},{name:'E-Book',color:'#166534',textColor:'#fff',abbr:'Bk'},{name:'Filmes',color:'#B45309',textColor:'#fff',abbr:'Fil'}], bonus_app:{name:'Ilimitado',color:'#111827',textColor:'#fff',abbr:'∞'}, details:['Internet 100% Fibra Óptica','Wi-Fi 6 incluso','40 canais de TV grátis','Filmes e E-Books inclusos','Velocidade ilimitada','Instalação por R$ 39,90'], popular:true, active:true, sort_order:1 },
      { name:'800 MEGA', speed:'800', price:'119,90', highlight:'Alta performance para tudo', highlight_icon:'🚀', button_text:'EU QUERO!', whatsapp_msg:'Olá!%20Vim%20pelo%20site%20e%20gostaria%20de%20contratar%20o%20plano%20de%20800%20MEGA.', included_apps:[{name:'Wi-Fi 6',color:'#6B21A8',textColor:'#fff',abbr:'WiFi'},{name:'TV 40ch',color:'#1E40AF',textColor:'#fff',abbr:'TV'},{name:'E-Book',color:'#166534',textColor:'#fff',abbr:'Bk'},{name:'Filmes',color:'#B45309',textColor:'#fff',abbr:'Fil'}], bonus_app:{name:'2 Roteadores',color:'#7C3AED',textColor:'#fff',abbr:'2R'}, details:['Internet 100% Fibra Óptica','2 Roteadores Mesh Wi-Fi 6','40 canais de TV grátis','Filmes e E-Books inclusos','Velocidade ilimitada','Instalação GRÁTIS'], popular:false, active:true, sort_order:2 },
      { name:'LINK DEDICADO', speed:'DED', price:'Sob Consulta', highlight:'Conexão exclusiva para empresas', highlight_icon:'🏢', button_text:'CONSULTAR', whatsapp_msg:'Olá!%20Vim%20pelo%20site%20e%20gostaria%20de%20mais%20informações%20sobre%20o%20Link%20Dedicado.', included_apps:[{name:'IP Fixo',color:'#1D4ED8',textColor:'#fff',abbr:'IP'},{name:'SLA 24h',color:'#065F46',textColor:'#fff',abbr:'SLA'},{name:'Simétrico',color:'#7C3AED',textColor:'#fff',abbr:'Sim'}], bonus_app:{name:'Suporte VIP',color:'#991B1B',textColor:'#fff',abbr:'VIP'}, details:['Banda garantida 100%','Upload e download simétricos','IP fixo incluso','Suporte SLA 24/7/365','Monitoramento em tempo real','Proposta personalizada'], popular:false, active:true, sort_order:3 },
    ];
    plans.forEach((p, i) => db.data.plans.push({ id: i+1, ...p }));
  }

  // ── Seed: enterprise_plans ────────────────────────────────────────
  if (!db.data.enterprise_plans) db.data.enterprise_plans = [];
  if (db.data.enterprise_plans.length === 0) {
    const plans = [
      { name:'LINK DEDICADO 50MB', speed:'50', price:'Sob Consulta', highlight:'Conexão dedicada para sua empresa', highlight_icon:'🏢', button_text:'CONSULTAR', whatsapp_msg:'Olá!%20Vim%20pela%20página%20de%20empresas%20e%20gostaria%20de%20saber%20mais%20sobre%20o%20Link%20Dedicado%2050MB.', features:['Banda garantida 100%','Upload e download simétricos','IP fixo incluso','SLA 24/7/365'], popular:false, active:true, sort_order:0, card_bg_color:'', card_text_color:'', button_bg_color:'#005CFF', button_text_color:'#ffffff' },
      { name:'LINK DEDICADO 100MB', speed:'100', price:'Sob Consulta', highlight:'Performance máxima para sua empresa', highlight_icon:'🚀', button_text:'CONSULTAR', whatsapp_msg:'Olá!%20Vim%20pela%20página%20de%20empresas%20e%20gostaria%20de%20saber%20mais%20sobre%20o%20Link%20Dedicado%20100MB.', features:['Banda garantida 100%','Upload e download simétricos','IP fixo incluso','SLA 24/7/365','Monitoramento em tempo real'], popular:true, active:true, sort_order:1, card_bg_color:'', card_text_color:'', button_bg_color:'#005CFF', button_text_color:'#ffffff' },
      { name:'FIBRA EMPRESARIAL 200MB', speed:'200', price:'199,90', highlight:'Internet de alta velocidade para PMEs', highlight_icon:'📶', button_text:'CONTRATAR', whatsapp_msg:'Olá!%20Vim%20pela%20página%20de%20empresas%20e%20gostaria%20de%20contratar%20a%20Fibra%20Empresarial%20200MB.', features:['Internet 100% Fibra Óptica','Wi-Fi 6 empresarial','IP fixo incluso','Suporte prioritário','Instalação prioritária'], popular:false, active:true, sort_order:2, card_bg_color:'', card_text_color:'', button_bg_color:'#005CFF', button_text_color:'#ffffff' },
      { name:'PLANO PERSONALIZADO', speed:'—', price:'Sob Consulta', highlight:'Sob medida para o seu negócio', highlight_icon:'🎯', button_text:'FALAR CONOSCO', whatsapp_msg:'Olá!%20Vim%20pela%20página%20de%20empresas%20e%20gostaria%20de%20um%20plano%20personalizado%20para%20minha%20empresa.', features:['Projeto personalizado','Contrato flexível','Suporte 24/7 dedicado','Equipamentos inclusos','Garantia de disponibilidade'], popular:false, active:true, sort_order:3, card_bg_color:'#1e0a3c', card_text_color:'#ffffff', button_bg_color:'#22c55e', button_text_color:'#ffffff' },
    ];
    plans.forEach((p, i) => db.data.enterprise_plans.push({ id: i+1, ...p }));
  }

  // ── Seed: quick_links ────────────────────────────────────────────
  if (db.data.quick_links.length === 0) {
    const links = [
      { title:'Não é cliente?', description:'Conheça nossos planos e ofertas de internet.', url:'https://api.whatsapp.com/send?phone=559830420030&text=Olá!%20Vim%20pelo%20site%20e%20gostaria%20de%20contratar%20a%20internet', button_text:'Conhecer Planos', icon_type:'user', sort_order:0, active:true, card_bg:'', icon_bg:'#2563EB20', icon_color:'#2563EB', title_color:'', title_font_size:'', desc_color:'', desc_font_size:'', btn_color:'#2563EB' },
      { title:'Perdeu o prazo?', description:'Emita a segunda via do seu boleto de forma rápida.', url:'https://ixc.mundonetbandalarga.com.br/central_assinante_web/login', button_text:'Emitir Boleto', icon_type:'document', sort_order:1, active:true, card_bg:'', icon_bg:'#05966920', icon_color:'#059669', title_color:'', title_font_size:'', desc_color:'', desc_font_size:'', btn_color:'#059669' },
      { title:'Precisa de suporte?', description:'Fale com o nosso suporte técnico especializado.', url:'https://api.whatsapp.com/send?phone=559830420030&text=Olá!%20Vim%20pelo%20site%20e%20gostaria%20de%20suporte.', button_text:'Suporte Técnico', icon_type:'chat', sort_order:2, active:true, card_bg:'', icon_bg:'#7C3AED20', icon_color:'#7C3AED', title_color:'', title_font_size:'', desc_color:'', desc_font_size:'', btn_color:'#7C3AED' },
      { title:'Teste de velocidade?', description:'Faça um teste de velocidade de conexões agora.', url:'https://www.speedtest.net/pt', button_text:'Testar Velocidade', icon_type:'speed', sort_order:3, active:true, card_bg:'', icon_bg:'#DC262620', icon_color:'#DC2626', title_color:'', title_font_size:'', desc_color:'', desc_font_size:'', btn_color:'#DC2626' },
    ];
    links.forEach((l, i) => db.data.quick_links.push({ id: i+1, ...l }));
  }

  // ── Seed: benefits ────────────────────────────────────────────────
  if (db.data.benefits.length === 0) {
    const items = [
      { title:'Planos perfeitos', description:'Atendentes especializados te indicam o plano perfeito para sua necessidade', icon_type:'star', sort_order:0, active:true, icon_bg:'#2563EB20', icon_color:'#2563EB', title_color:'', desc_color:'' },
      { title:'Tráfego ilimitado', description:'Sem limite de uso, para você poder fazer tudo o que ama online!', icon_type:'speed', sort_order:1, active:true, icon_bg:'#2563EB20', icon_color:'#2563EB', title_color:'', desc_color:'' },
      { title:'Pós Pago', description:'Utilize antes, pague depois e ganhe desconto pagando em dia!', icon_type:'clock', sort_order:2, active:true, icon_bg:'#2563EB20', icon_color:'#2563EB', title_color:'', desc_color:'' },
      { title:'Internet Gaming', description:'Rota exclusiva para gamers, com ping muito menor e velocidade muito maior!', icon_type:'globe', sort_order:3, active:true, icon_bg:'#2563EB20', icon_color:'#2563EB', title_color:'', desc_color:'' },
      { title:'Instalação rápida', description:'Saiba o dia da instalação, e vai ser em menos de 48 horas, legal né?', icon_type:'download', sort_order:4, active:true, icon_bg:'#2563EB20', icon_color:'#2563EB', title_color:'', desc_color:'' },
      { title:'Suporte rápido', description:'Em raras ocasiões vamos ter um prazo máximo de 24 horas após a solicitação!', icon_type:'chat', sort_order:5, active:true, icon_bg:'#2563EB20', icon_color:'#2563EB', title_color:'', desc_color:'' },
      { title:'Roteador de alta potência', description:'Roteador de longo alcance, 1200Mbps e frequências 2.4 e 5.8 Ghz', icon_type:'shield', sort_order:6, active:true, icon_bg:'#2563EB20', icon_color:'#2563EB', title_color:'', desc_color:'' },
      { title:'Tecnologia nova', description:'Equipamentos novos para velocidade de conexão e estabilidade do serviço', icon_type:'gift', sort_order:7, active:true, icon_bg:'#2563EB20', icon_color:'#2563EB', title_color:'', desc_color:'' },
    ];
    items.forEach((b, i) => db.data.benefits.push({ id: i+1, ...b }));
  }

  // ── Seed: entertainment ──────────────────────────────────────────
  if (db.data.entertainment.length === 0) {
    const apps = [
      { name:'Deezer', icon:'🎵', logo_url:'https://mundonetbandalarga.com.br/wp-content/uploads/2025/01/deezer-logo.png', description:'Onde a música ganha vida', link_url:'https://www.deezer.com/', sort_order:0, active:true },
      { name:'Max', icon:'🎬', logo_url:'https://mundonetbandalarga.com.br/wp-content/uploads/2025/01/max-logo.png', description:'Grandes histórias, dramas imperdíveis e as melhores comédias', link_url:'https://www.max.com/', sort_order:1, active:true },
      { name:'Kaspersky', icon:'🛡️', logo_url:'https://mundonetbandalarga.com.br/wp-content/uploads/2025/01/kaspersky-logo.png', description:'Proteção completa contra ameaças digitais', link_url:'https://www.kaspersky.com/', sort_order:2, active:true },
      { name:'PlayKids', icon:'🧒', logo_url:'https://mundonetbandalarga.com.br/wp-content/uploads/2025/01/playkids-logo.png', description:'Diversão e aprendizado para as crianças', link_url:'https://www.playkids.com/', sort_order:3, active:true },
      { name:'Telecine', icon:'🎞️', logo_url:'https://mundonetbandalarga.com.br/wp-content/uploads/2025/01/telecine-logo.png', description:'O melhor do cinema em casa', link_url:'https://www.telecine.com/', sort_order:4, active:true },
      { name:'Paramount+', icon:'🌟', logo_url:'https://mundonetbandalarga.com.br/wp-content/uploads/2025/01/paramount-logo.png', description:'Séries, filmes e esportes ao vivo', link_url:'https://www.paramountplus.com/', sort_order:5, active:true },
    ];
    apps.forEach((a, i) => db.data.entertainment.push({ id: i+1, ...a }));
  }

  // ── Seed: contact_info ───────────────────────────────────────────
  if (db.data.contact_info.length === 0) {
    const contacts = [
      { key:'phone', value:'(98) 3042-0030', label:'Telefone Fixo' },
      { key:'phone_raw', value:'559830420030', label:'Telefone (formato WhatsApp)' },
      { key:'whatsapp', value:'https://api.whatsapp.com/send?phone=559830420030&text=Olá!%20Vim%20pelo%20site%20e%20gostaria%20de%20contratar%20a%20internet.', label:'Link WhatsApp' },
      { key:'instagram', value:'https://www.instagram.com/_mundonet/', label:'Instagram URL' },
      { key:'instagram_handle', value:'@_mundonet', label:'Instagram @' },
      { key:'email', value:'contato@mundonetbandalarga.com.br', label:'E-mail' },
      { key:'address', value:'São Luís - MA', label:'Endereço' },
      { key:'maps_url', value:'https://maps.app.goo.gl/mrMYuZiMiBY6ei527', label:'Link Google Maps' },
      { key:'maps_embed', value:'https://maps.google.com/maps?q=mundonet%20telecom&t=m&z=15&output=embed&iwloc=near', label:'Embed Maps' },
      { key:'intro_text', value:'Precisa tirar dúvidas, contratar um plano ou solicitar suporte? Nossa equipe está pronta para atendê-lo da melhor forma possível.', label:'Texto de Introdução' },
    ];
    contacts.forEach((c, i) => db.data.contact_info.push({ id: i+1, ...c }));
  }

  // ── Seed: site_settings ──────────────────────────────────────────
  if (db.data.site_settings.length === 0) {
    // Tema global (customização via ManageSiteCustomization)
    db.data.site_settings.push({
      id: 1,
      key: '_global_theme',
      value: JSON.stringify({
        customization_enabled: true,
        bg_color: '#f3e8ff',
        text_color: '#4b5563',
        title_color: '#1e1b4b',
        primary_font: 'Montserrat, sans-serif',
        section_spacing: '80px',
        accent_color: '#005CFF',
        accent_hover_color: '#0046CC',
        button_bg_color: '#005CFF',
        button_text_color: '#ffffff',
        section_bg_color: '#ffffff',
        section_border_color: '#E2E8F0',
        card_bg_color: '#ffffff',
        card_text_color: '#1E293B',
        hero_overlay_color: 'rgba(0, 45, 114, 0.7)',
        hero_overlay_enabled: true,
        border_radius: '16px',
        hero_height: 650,
        hero_width: 600,
        hero_transition: 'fade',
        hero_show_buttons: true,
        hero_btn1_text: 'Ver Planos',
        hero_btn1_link: '#internet',
        hero_btn1_bg: '#ff6a00',
        hero_btn1_text_color: '#ffffff',
        hero_btn2_text: 'Falar com Atendente',
        hero_btn2_link: 'https://api.whatsapp.com/send?phone=559830420030&text=Olá!%20Vim%20pelo%20site%20e%20gostaria%20de%20contratar%20a%20internet.',
        hero_btn2_bg: 'rgba(255, 255, 255, 0.15)',
        hero_btn2_text_color: '#ffffff'
      }),
      label: 'Tema Global'
    });
    const settings = [
      // Geral
      { key:'site_name', value:'Mundonet Banda Larga', label:'Nome do Site' },
      { key:'logo_url', value:'https://mundonetbandalarga.com.br/wp-content/uploads/2023/10/logo-mundonet.png', label:'Logo URL' },
      { key:'primary_color', value:'#002D72', label:'Cor Primária' },
      { key:'whatsapp_float', value:'https://api.whatsapp.com/send?phone=559830420030&text=Olá!%20Vim%20pelo%20site%20e%20gostaria%20de%20contratar%20a%20internet.', label:'WhatsApp Flutuante' },
      { key:'footer_cnpj', value:'07.038.108/0001-94', label:'CNPJ' },
      { key:'footer_anatel', value:'00060-7999', label:'Nº Anatel' },
      // Cabeçalho (Header)
      { key:'header_bg_color', value:'#002D72', label:'Header: Cor de fundo' },
      { key:'header_text_color', value:'#ffffff', label:'Header: Cor do texto' },
      { key:'header_topbar_bg', value:'#001a4d', label:'Header: Fundo da barra superior' },
      { key:'header_topbar_text', value:'#ffffff', label:'Header: Texto da barra superior' },
      { key:'header_font', value:'', label:'Header: Fonte (Google Fonts, ex: Poppins)' },
      { key:'header_portal_url', value:'https://ixc.mundonetbandalarga.com.br/central_assinante_web/login', label:'Header: URL do Portal do Assinante' },
      { key:'header_portal_text', value:'Portal do Assinante', label:'Header: Texto do botão Portal' },
      { key:'header_portal_bg', value:'#4f46e5', label:'Header: Cor de fundo do botão Portal' },
      { key:'header_portal_text_color', value:'#ffffff', label:'Header: Cor do texto do botão Portal' },
      { key:'header_height', value:'80', label:'Header: Altura do cabeçalho (px)' },
      { key:'header_nav_item1_text', value:'Planos', label:'Nav: Item 1 Texto' },
      { key:'header_nav_item2_text', value:'App Mundonet +', label:'Nav: Item 2 Texto' },
      { key:'header_nav_item3_text', value:'Para Você', label:'Nav: Item 3 Texto' },
      { key:'header_nav_item4_text', value:'Para Empresas', label:'Nav: Item 4 Texto' },
      { key:'header_nav_item5_text', value:'Trabalhe Conosco', label:'Nav: Item 5 Texto' },
      // Rodapé (Footer)
      { key:'footer_bg_color', value:'#002D72', label:'Footer: Cor de fundo' },
      { key:'footer_text_color', value:'#cbd5e1', label:'Footer: Cor do texto' },
      { key:'footer_heading_color', value:'#ffffff', label:'Footer: Cor dos títulos' },
      { key:'footer_link_color', value:'#93c5fd', label:'Footer: Cor dos links' },
      { key:'footer_about_text', value:'Conectando você com o mundo através de conexões de ultravelocidade 100% fibra óptica com tecnologia Wi-Fi 6 de ponta.', label:'Footer: Texto institucional' },
      { key:'footer_col2_title', value:'CONTATO', label:'Footer: Título coluna 2' },
      { key:'footer_col3_title', value:'ATALHOS', label:'Footer: Título coluna 3' },
      { key:'footer_col4_title', value:'ONDE NOS ENCONTRAR', label:'Footer: Título coluna 4' },
      { key:'footer_subbar_bg', value:'#001240', label:'Footer: Fundo da barra inferior' },
      { key:'footer_subbar_text', value:'#94a3b8', label:'Footer: Cor do texto da barra inferior' },
      { key:'footer_anatel_logo_url', value:'https://mundonetbandalarga.com.br/wp-content/uploads/2025/01/anatel-logo-1024x248.png', label:'Footer: URL logo Anatel' },
      { key:'footer_font', value:'', label:'Footer: Fonte (Google Fonts, ex: Poppins)' },
      { key:'footer_padding', value:'60px 0', label:'Footer: Espaçamento interno (padding)' },
      { key:'footer_logo_url', value:'', label:'Footer: URL da Logomarca' },
      // Entretenimento (Apps Carrossel)
      { key:'ent_subtitle', value:'Aplicativos para diversão, entretenimento e segurança para toda a família', label:'Entretenimento: Subtítulo' },
      { key:'ent_title', value:'Aplicativos de entretenimento que traz diversão para toda a família. Junte-se a nós e descubra uma nova forma de se divertir juntos!', label:'Entretenimento: Título' },
      { key:'ent_bottom_text', value:'Fale com nosso time e consulte a disponibilidade dos aplicativos.', label:'Entretenimento: Texto inferior' },
      { key:'ent_btn_text', value:'Fale com nosso time', label:'Entretenimento: Texto do botão' },
      { key:'ent_btn_bg', value:'#6d28d9', label:'Entretenimento: Cor de fundo do botão' },
      { key:'ent_btn_text_color', value:'#ffffff', label:'Entretenimento: Cor do texto do botão' },
      { key:'ent_btn_link', value:'https://api.whatsapp.com/send?phone=559830420030&text=Olá!%20Quero%20saber%20sobre%20os%20aplicativos%20disponíveis.', label:'Entretenimento: Link do botão' },
      { key:'ent_bg_color', value:'#f8fafc', label:'Entretenimento: Cor de fundo' },
      { key:'ent_text_color', value:'#1e293b', label:'Entretenimento: Cor do texto' },
      { key:'ent_carousel_bg', value:'#ffffff', label:'Entretenimento: Fundo do carrossel' },
      { key:'ent_title_font_size', value:'28px', label:'Entretenimento: Tamanho do Título' },
      { key:'ent_title_font', value:'', label:'Entretenimento: Fonte do Título' },
      { key:'ent_subtitle_font_size', value:'0.95rem', label:'Entretenimento: Tamanho do Subtítulo' },
      { key:'ent_bottom_font_size', value:'0.92rem', label:'Entretenimento: Tamanho Texto Inferior' },
      { key:'ent_btn_font_size', value:'0.95rem', label:'Entretenimento: Tamanho Botão' },
    ];
    settings.forEach((s, i) => db.data.site_settings.push({ id: i+2, ...s }));

    // Ordem padrão das seções
    db.data.site_settings.push({
      id: settings.length + 2,
      key: 'sections_order',
      value: JSON.stringify(['hero','quicklinks','plans','benefits','app','specialties','entertainment','cta','support','contact']),
      label: 'Ordem das Seções'
    });
    // Seções ativas (todas ativas por padrão)
    db.data.site_settings.push({
      id: settings.length + 3,
      value: JSON.stringify({ hero:true, quicklinks:true, plans:true, benefits:true, app:true, specialties:true, entertainment:true, cta:true, support:true, contact:true }),
      label: 'Seções Ativas'
    });
    // Popup de saída
    const exitPopupDefaults = [
      { key:'exit_popup_enabled', value:'true', label:'Popup de Saída: Ativo' },
      { key:'exit_popup_title', value:'Ainda está aí?', label:'Popup de Saída: Título' },
      { key:'exit_popup_subtitle', value:'Entre em contato e contrate com a gente de forma simples e segura!', label:'Popup de Saída: Subtítulo' },
      { key:'exit_popup_bg_color', value:'#1a1028', label:'Popup de Saída: Cor de Fundo' },
      { key:'exit_popup_text_color', value:'#a1a1aa', label:'Popup de Saída: Cor do Texto' },
      { key:'exit_popup_title_color', value:'#ffffff', label:'Popup de Saída: Cor do Título' },
      { key:'exit_popup_accent_color', value:'#a855f7', label:'Popup de Saída: Cor de Destaque' },
      { key:'exit_popup_card_bg', value:'#2a1f3d', label:'Popup de Saída: Cor dos Cards' },
      { key:'exit_popup_card_border', value:'rgba(255,255,255,0.08)', label:'Popup de Saída: Borda dos Cards' },
      { key:'exit_popup_overlay_color', value:'rgba(0,0,0,0.6)', label:'Popup de Saída: Cor do Overlay' },
      { key:'exit_popup_cards', value:JSON.stringify([
        { id:1, title:'Contratar agora', description:'Contratar agora pelo WhatsApp', link:'https://api.whatsapp.com/send?phone=559830420030&text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20contratar%20a%20internet.', icon_type:'whatsapp' },
        { id:2, title:'Suporte', description:'Suporte técnico via WhatsApp', link:'https://api.whatsapp.com/send?phone=559830420030&text=Ol%C3%A1!%20Preciso%20de%20suporte%20t%C3%A9cnico.', icon_type:'support' },
        { id:3, title:'Telefone', description:'Ligue para nós agora', link:'tel:+559830420030', icon_type:'phone' },
        { id:4, title:'E-mail', description:'Escreva para nós', link:'mailto:contato@mundonetbandalarga.com.br', icon_type:'email' },
      ]), label:'Popup de Saída: Cards' },
    ];
    exitPopupDefaults.forEach((s, i) => db.data.site_settings.push({ id: settings.length + 4 + i, ...s }));
  }

  // ── Migração: sections_order ─────────────────────────────────────
  if (!db.data.site_settings.find(s => s.key === 'sections_order')) {
    db.data.site_settings.push({
      id: db.nextId('site_settings'),
      key: 'sections_order',
      value: JSON.stringify(['hero','quicklinks','plans','benefits','app','specialties','entertainment','cta','support','contact']),
      label: 'Ordem das Seções'
    });
  }

  // ── Migração: sections_active ────────────────────────────────────
  if (!db.data.site_settings.find(s => s.key === 'sections_active')) {
    db.data.site_settings.push({
      id: db.nextId('site_settings'),
      key: 'sections_active',
      value: JSON.stringify({ hero:true, quicklinks:true, plans:true, benefits:true, app:true, specialties:true, entertainment:true, cta:true, support:true, contact:true }),
      label: 'Seções Ativas'
    });
  }

  // ── Migração: exit_popup ─────────────────────────────────────────
  const exitPopupKeys = ['exit_popup_enabled','exit_popup_title','exit_popup_subtitle','exit_popup_bg_color','exit_popup_text_color','exit_popup_title_color','exit_popup_accent_color','exit_popup_card_bg','exit_popup_card_border','exit_popup_overlay_color','exit_popup_cards'];
  const exitPopupDefaults = {
    exit_popup_enabled: 'true',
    exit_popup_title: 'Ainda está aí?',
    exit_popup_subtitle: 'Entre em contato e contrate com a gente de forma simples e segura!',
    exit_popup_bg_color: '#1a1028',
    exit_popup_text_color: '#a1a1aa',
    exit_popup_title_color: '#ffffff',
    exit_popup_accent_color: '#a855f7',
    exit_popup_card_bg: '#2a1f3d',
    exit_popup_card_border: 'rgba(255,255,255,0.08)',
    exit_popup_overlay_color: 'rgba(0,0,0,0.6)',
    exit_popup_cards: JSON.stringify([
      { id:1, title:'Contratar agora', description:'Contratar agora pelo WhatsApp', link:'https://api.whatsapp.com/send?phone=559830420030&text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20contratar%20a%20internet.', icon_type:'whatsapp' },
      { id:2, title:'Suporte', description:'Suporte técnico via WhatsApp', link:'https://api.whatsapp.com/send?phone=559830420030&text=Ol%C3%A1!%20Preciso%20de%20suporte%20t%C3%A9cnico.', icon_type:'support' },
      { id:3, title:'Telefone', description:'Ligue para nós agora', link:'tel:+559830420030', icon_type:'phone' },
      { id:4, title:'E-mail', description:'Escreva para nós', link:'mailto:contato@mundonetbandalarga.com.br', icon_type:'email' },
    ]),
  };
  for (const key of exitPopupKeys) {
    if (!db.data.site_settings.find(s => s.key === key)) {
      db.data.site_settings.push({
        id: db.nextId('site_settings'),
        key,
        value: exitPopupDefaults[key] || '',
        label: 'Popup de Saída: ' + key.replace('exit_popup_', '')
      });
    }
  }

  // ── Migração: footer_logo_url ────────────────────────────────────
  if (!db.data.site_settings.find(s => s.key === 'footer_logo_url')) {
    db.data.site_settings.push({
      id: db.nextId('site_settings'),
      key: 'footer_logo_url',
      value: '',
      label: 'Footer: URL da Logomarca'
    });
  }

  // ── Migração: entretenimento (novas settings + campos) ────────────
  const entSettings = [
    { key:'ent_subtitle', value:'Aplicativos para diversão, entretenimento e segurança para toda a família', label:'Entretenimento: Subtítulo' },
    { key:'ent_title', value:'Aplicativos de entretenimento que traz diversão para toda a família. Junte-se a nós e descubra uma nova forma de se divertir juntos!', label:'Entretenimento: Título' },
    { key:'ent_bottom_text', value:'Fale com nosso time e consulte a disponibilidade dos aplicativos.', label:'Entretenimento: Texto inferior' },
    { key:'ent_btn_text', value:'Fale com nosso time', label:'Entretenimento: Texto do botão' },
    { key:'ent_btn_bg', value:'#6d28d9', label:'Entretenimento: Cor de fundo do botão' },
    { key:'ent_btn_text_color', value:'#ffffff', label:'Entretenimento: Cor do texto do botão' },
    { key:'ent_btn_link', value:'https://api.whatsapp.com/send?phone=559830420030&text=Olá!%20Quero%20saber%20sobre%20os%20aplicativos%20disponíveis.', label:'Entretenimento: Link do botão' },
    { key:'ent_bg_color', value:'#f8fafc', label:'Entretenimento: Cor de fundo' },
    { key:'ent_text_color', value:'#1e293b', label:'Entretenimento: Cor do texto' },
    { key:'ent_carousel_bg', value:'#ffffff', label:'Entretenimento: Fundo do carrossel' },
    { key:'ent_title_font_size', value:'28px', label:'Entretenimento: Tamanho do Título' },
    { key:'ent_title_font', value:'', label:'Entretenimento: Fonte do Título' },
    { key:'ent_subtitle_font_size', value:'0.95rem', label:'Entretenimento: Tamanho do Subtítulo' },
    { key:'ent_bottom_font_size', value:'0.92rem', label:'Entretenimento: Tamanho Texto Inferior' },
    { key:'ent_btn_font_size', value:'0.95rem', label:'Entretenimento: Tamanho Botão' },
  ];
  for (const s of entSettings) {
    if (!db.data.site_settings.find(x => x.key === s.key)) {
      db.data.site_settings.push({ id: db.nextId('site_settings'), ...s });
    }
  }
  // Migrar itens existentes do entertainment para incluir campos novos
  if (db.data.entertainment.length > 0 && !('logo_url' in db.data.entertainment[0])) {
    for (const item of db.data.entertainment) {
      if (!item.logo_url) item.logo_url = '';
      if (!item.banner_url) item.banner_url = '';
      if (!item.description) item.description = '';
      if (!item.link_url) item.link_url = '';
    }
    console.log('  → Itens de entretenimento migrados com campos logo_url, banner_url, description, link_url');
  }

  // ── Migração: Central de Atendimento ──────────────────────────────
  const supportSettings = [
    { key:'support_bg_color', value:'#f5f0ff', label:'Central de Atendimento: Cor de Fundo' },
    { key:'support_padding', value:'60px 20px', label:'Central de Atendimento: Espaçamento Interno' },
    { key:'support_title_color', value:'#1e1b4b', label:'Central de Atendimento: Cor dos Títulos' },
    { key:'support_desc_color', value:'#64748b', label:'Central de Atendimento: Cor das Descrições' },
    { key:'support_card_bg', value:'#ffffff', label:'Central de Atendimento: Cor de Fundo dos Cards' },
    { key:'support_card_border', value:'#e9e5f5', label:'Central de Atendimento: Cor da Borda dos Cards' },
    { key:'support_card_text_color', value:'#1e1b4b', label:'Central de Atendimento: Cor do Texto dos Cards' },
    { key:'support_left_title', value:'Somos a Mundonet', label:'Central de Atendimento: Título Lado Esquerdo' },
    { key:'support_left_desc', value:'Na Mundonet, em todas as nossas ações, acreditamos em desafiar os "valores" tradicionais dos provedores de internet. Fazemos isso tratando você como um parceiro que desejamos apoiar, e não apenas como um "cliente".', label:'Central de Atendimento: Descrição Lado Esquerdo' },
    { key:'support_left_highlight', value:'Faça parte deste movimento.', label:'Central de Atendimento: Texto Destaque' },
    { key:'support_left_btn_text', value:'Conheça mais', label:'Central de Atendimento: Texto do Botão Esquerdo' },
    { key:'support_left_btn_link', value:'#', label:'Central de Atendimento: Link do Botão Esquerdo' },
    { key:'support_left_btn_bg', value:'#7c3aed', label:'Central de Atendimento: Cor de Fundo do Botão Esquerdo' },
    { key:'support_left_btn_color', value:'#ffffff', label:'Central de Atendimento: Cor do Texto do Botão Esquerdo' },
    { key:'support_left_btn_font_size', value:'16px', label:'Central de Atendimento: Tamanho da Fonte Botão Esquerdo' },
    { key:'support_left_btn_padding', value:'14px 40px', label:'Central de Atendimento: Espaçamento Botão Esquerdo' },
    { key:'support_left_btn_border_radius', value:'8px', label:'Central de Atendimento: Arredondamento Botão Esquerdo' },
    { key:'support_right_title', value:'Canais de atendimento', label:'Central de Atendimento: Título Lado Direito' },
    { key:'support_right_desc', value:'Conheça os canais de atendimento da Mundonet e entre em contato com nosso time, estamos sempre a disposição.', label:'Central de Atendimento: Descrição Lado Direito' },
    { key:'support_ch1_value', value:'0800 765 5507', label:'Central de Atendimento: Canal 1 Valor' },
    { key:'support_ch1_label', value:'Whatsapp e telefone', label:'Central de Atendimento: Canal 1 Rótulo' },
    { key:'support_ch1_link', value:'https://api.whatsapp.com/send?phone=559830420030', label:'Central de Atendimento: Canal 1 Link' },
    { key:'support_ch1_icon', value:'phone', label:'Central de Atendimento: Canal 1 Ícone' },
    { key:'support_ch2_value', value:'contato@mundonetbandalarga.com.br', label:'Central de Atendimento: Canal 2 Valor' },
    { key:'support_ch2_label', value:'Por e-mail', label:'Central de Atendimento: Canal 2 Rótulo' },
    { key:'support_ch2_link', value:'mailto:contato@mundonetbandalarga.com.br', label:'Central de Atendimento: Canal 2 Link' },
    { key:'support_ch2_icon', value:'email', label:'Central de Atendimento: Canal 2 Ícone' },
    { key:'support_ch_btn1_text', value:'Entre em contato', label:'Central de Atendimento: Botão 1 Texto' },
    { key:'support_ch_btn1_link', value:'https://api.whatsapp.com/send?phone=559830420030', label:'Central de Atendimento: Botão 1 Link' },
    { key:'support_ch_btn1_bg', value:'#7c3aed', label:'Central de Atendimento: Botão 1 Cor de Fundo' },
    { key:'support_ch_btn1_color', value:'#ffffff', label:'Central de Atendimento: Botão 1 Cor do Texto' },
    { key:'support_ch_btn2_text', value:'Quero que me liguem', label:'Central de Atendimento: Botão 2 Texto' },
    { key:'support_ch_btn2_link', value:'tel:+559830420030', label:'Central de Atendimento: Botão 2 Link' },
    { key:'support_ch_btn2_bg', value:'#ffffff', label:'Central de Atendimento: Botão 2 Cor de Fundo' },
    { key:'support_ch_btn2_color', value:'#7c3aed', label:'Central de Atendimento: Botão 2 Cor do Texto' },
  ];
  for (const s of supportSettings) {
    if (!db.data.site_settings.find(x => x.key === s.key)) {
      db.data.site_settings.push({ id: db.nextId('site_settings'), ...s });
    }
  }

  // ── Garantir que o _global_theme exista e tenha todos os campos (migração p/ db existente) ──
  const themeDefaults = {
    customization_enabled: true,
    bg_color: '#f3e8ff',
    text_color: '#4b5563',
    title_color: '#1e1b4b',
    primary_font: 'Montserrat, sans-serif',
    section_spacing: '80px',
    accent_color: '#005CFF',
    accent_hover_color: '#0046CC',
    button_bg_color: '#005CFF',
    button_text_color: '#ffffff',
    section_bg_color: '#ffffff',
    section_border_color: '#E2E8F0',
    card_bg_color: '#ffffff',
    card_text_color: '#1E293B',
    hero_overlay_color: 'rgba(0, 45, 114, 0.7)',
    hero_overlay_enabled: true,
    border_radius: '16px',
    hero_height: 650,
    hero_width: 600,
    hero_transition: 'fade',
    hero_show_buttons: true,
    hero_btn1_text: 'Ver Planos',
    hero_btn1_link: '#internet',
    hero_btn1_bg: '#ff6a00',
    hero_btn1_text_color: '#ffffff',
    hero_btn2_text: 'Falar com Atendente',
    hero_btn2_link: 'https://api.whatsapp.com/send?phone=559830420030&text=Olá!%20Vim%20pelo%20site%20e%20gostaria%20de%20contratar%20a%20internet.',
    hero_btn2_bg: 'rgba(255, 255, 255, 0.15)',
    hero_btn2_text_color: '#ffffff'
  };

  const existingTheme = db.data.site_settings.find(s => s.key === '_global_theme');
  if (!existingTheme) {
    db.data.site_settings.push({
      id: db.nextId('site_settings'),
      key: '_global_theme',
      value: JSON.stringify(themeDefaults),
      label: 'Tema Global'
    });
  } else {
    const parsed = JSON.parse(existingTheme.value);
    let changed = false;
    for (const [key, defaultValue] of Object.entries(themeDefaults)) {
      if (!(key in parsed)) {
        parsed[key] = defaultValue;
        changed = true;
      }
    }
    // Migrar hero_width de porcentagem (<=100) para pixels (600)
    if ('hero_width' in parsed && parsed.hero_width <= 100 && parsed.hero_width !== 600) {
      parsed.hero_width = 600;
      changed = true;
    }
    if (changed) {
      existingTheme.value = JSON.stringify(parsed);
    }
  }

  // ── Migração: quick_links (adicionar campos ausentes) ──────────────
  if (db.data.quick_links.length > 0) {
    const qlDefaults = { card_bg:'', icon_bg:'', icon_color:'', title_color:'', title_font_size:'', desc_color:'', desc_font_size:'', btn_color:'' };
    for (const ql of db.data.quick_links) {
      let changed = false;
      for (const [key, defaultValue] of Object.entries(qlDefaults)) {
        if (!(key in ql)) {
          ql[key] = defaultValue;
          changed = true;
        }
      }
      if (changed) console.log(`  → quick_link #${ql.id} atualizado com campos de personalização`);
    }
  }

  // ── Migração: benefits (adicionar campos ausentes) ───────────────
  if (db.data.benefits.length > 0) {
    const bDefaults = { icon_bg:'', icon_color:'', title_color:'', desc_color:'' };
    for (const b of db.data.benefits) {
      let changed = false;
      for (const [key, defaultValue] of Object.entries(bDefaults)) {
        if (!(key in b)) {
          b[key] = defaultValue;
          changed = true;
        }
      }
      if (changed) console.log(`  → benefit #${b.id} atualizado com campos de personalização`);
    }
  }

  // ── Migração: favicon_url ─────────────────────────────────────────
  if (!db.data.site_settings.find(s => s.key === 'favicon_url')) {
    db.data.site_settings.push({
      id: db.nextId('site_settings'),
      key: 'favicon_url',
      value: '/favicon.svg',
      label: 'URL do Favicon'
    });
    console.log('  → favicon_url adicionado às configurações');
  }

  // ── Migração: Landing Page (Vem pra Mundonet) ─────────────────────
  const lpSettings = [
    { key:'lp_hero_title', value:'Na MUNDONET você tem o', label:'LP: Título Hero' },
    { key:'lp_hero_highlight', value:'melhor do entretenimento do MUNDO!', label:'LP: Destaque Hero' },
    { key:'lp_hero_subtitle', value:'Internet 100% Fibra Óptica, alta velocidade e estabilidade garantida para navegar, jogar e assistir sem limites.', label:'LP: Subtítulo Hero' },
    { key:'lp_hero_image', value:'https://mundonetbandalarga.com.br/wp-content/uploads/2026/06/area-top_700.png', label:'LP: Imagem Hero' },
    { key:'lp_hero_bg_color', value:'#1a0533', label:'LP: Cor Fundo Hero' },
    { key:'lp_hero_text_color', value:'#ffffff', label:'LP: Cor Texto Hero' },
    { key:'lp_hero_highlight_color', value:'#22c55e', label:'LP: Cor Destaque Hero' },
    { key:'lp_plan_name', value:'700 MEGA', label:'LP: Nome do Plano' },
    { key:'lp_plan_speed', value:'700', label:'LP: Velocidade' },
    { key:'lp_plan_price', value:'39,90', label:'LP: Preço' },
    { key:'lp_plan_badge_text', value:'MEGA', label:'LP: Badge Texto' },
    { key:'lp_plan_period', value:'POR APENAS', label:'LP: Texto Acima Preço' },
    { key:'lp_plan_installment', value:'39,90', label:'LP: Instalação' },
    { key:'lp_plan_original_price', value:'129,90', label:'LP: Preço Original' },
    { key:'lp_plan_highlight_text', value:'1 APP DA ÁREA STANDARD A MAIS PARA VOCÊ UTILIZAR', label:'LP: Texto Destaque' },
    { key:'lp_plan_apps', value:'Deezer,Globoplay,Sky,Apple TV', label:'LP: Apps (vírgula)' },
    { key:'lp_plan_card_bg', value:'#ffffff', label:'LP: Cor Fundo Card' },
    { key:'lp_plan_price_color', value:'#16a34a', label:'LP: Cor Preço' },
    { key:'lp_plan_btn_text', value:'CONTRATAR AGORA', label:'LP: Texto Botão' },
    { key:'lp_plan_btn_link', value:'https://api.whatsapp.com/send?phone=559830420030&text=Olá!%20Vim%20pela%20landing%20page%20e%20quero%20contratar%20o%20plano%20de%20700%20MEGA.', label:'LP: Link Botão' },
    { key:'lp_plan_btn_color', value:'#16a34a', label:'LP: Cor Fundo Botão' },
    { key:'lp_plan_btn_text_color', value:'#ffffff', label:'LP: Cor Texto Botão' },
    { key:'lp_features_title', value:'Por que escolher a Mundonet?', label:'LP: Título Benefícios' },
    { key:'lp_features', value:'Internet 100% Fibra Óptica,Wi-Fi 6 incluso,40 canais de TV grátis,Filmes e E-Books inclusos,Instalação em até 48 horas,Suporte técnico rápido', label:'LP: Benefícios (vírgula)' },
    { key:'lp_cta_title', value:'Não perca essa oportunidade!', label:'LP: Título CTA' },
    { key:'lp_cta_desc', value:'Fale com nosso time e garanta seu plano com o melhor preço da região.', label:'LP: Descrição CTA' },
    { key:'lp_cta_btn_text', value:'Falar com Atendente', label:'LP: Texto Botão CTA' },
    { key:'lp_cta_btn_link', value:'https://api.whatsapp.com/send?phone=559830420030&text=Olá!%20Vim%20pela%20landing%20page%20e%20quero%20contratar%20a%20internet.', label:'LP: Link Botão CTA' },
    { key:'lp_cta_bg_color', value:'#16a34a', label:'LP: Cor Fundo CTA' },
    { key:'lp_cta_text_color', value:'#ffffff', label:'LP: Cor Texto CTA' },
    { key:'lp_cta_btn_color', value:'#ffffff', label:'LP: Cor Fundo Botão CTA' },
    { key:'lp_cta_btn_text_color', value:'#16a34a', label:'LP: Cor Texto Botão CTA' },
    { key:'lp_footer_text', value:'© 2026 Mundonet Telecom. Todos os direitos reservados.', label:'LP: Texto Rodapé' },
    { key:'lp_footer_bg_color', value:'#1a0533', label:'LP: Cor Fundo Rodapé' },
    { key:'lp_footer_text_color', value:'#a1a1aa', label:'LP: Cor Texto Rodapé' },
  ];
  for (const s of lpSettings) {
    if (!db.data.site_settings.find(x => x.key === s.key)) {
      db.data.site_settings.push({ id: db.nextId('site_settings'), ...s });
    }
  }

  // ── Migração: Indique e Ganhe ──────────────────────────────────────
  const igSettings = [
    { key:'ig_badge_text', value:'INDIQUE E GANHE', label:'IG: Texto Badge' },
    { key:'ig_badge_bg', value:'#22c55e', label:'IG: Cor Badge' },
    { key:'ig_badge_text_color', value:'#ffffff', label:'IG: Cor Texto Badge' },
    { key:'ig_hero_title', value:'Indique a', label:'IG: Título Hero (parte 1)' },
    { key:'ig_hero_highlight', value:'Mundonet', label:'IG: Destaque Hero' },
    { key:'ig_hero_title_suffix', value:'e ganhe recompensas!', label:'IG: Título Hero (parte 2)' },
    { key:'ig_hero_subtitle', value:'Livres seus amigos da burocracia e da lentidão dos provedores tradicionais indicando a internet 100% fibra óptica da Mundonet!', label:'IG: Subtítulo Hero' },
    { key:'ig_hero_image', value:'https://mundonetbandalarga.com.br/wp-content/uploads/2026/06/area-top_700.png', label:'IG: Imagem Hero' },
    { key:'ig_hero_bg', value:'#1a0533', label:'IG: Cor Fundo Hero' },
    { key:'ig_hero_title_color', value:'#ffffff', label:'IG: Cor Título Hero' },
    { key:'ig_hero_highlight_color', value:'#22c55e', label:'IG: Cor Destaque Hero' },
    { key:'ig_hero_subtitle_color', value:'#a1a1aa', label:'IG: Cor Subtítulo Hero' },
    { key:'ig_hero_btn_text', value:'Comece a Indicar', label:'IG: Texto Botão Hero' },
    { key:'ig_hero_btn_link', value:'#como-funciona', label:'IG: Link Botão Hero' },
    { key:'ig_hero_btn_bg', value:'#22c55e', label:'IG: Cor Fundo Botão Hero' },
    { key:'ig_hero_btn_color', value:'#ffffff', label:'IG: Cor Texto Botão Hero' },
    { key:'ig_steps_title', value:'Veja como é fácil indicar', label:'IG: Título Como Funciona' },
    { key:'ig_steps_subtitle', value:'Em apenas 3 passos simples você começa a ganhar recompensas', label:'IG: Subtítulo Como Funciona' },
    { key:'ig_steps_bg', value:'#ffffff', label:'IG: Cor Fundo Como Funciona' },
    { key:'ig_steps_title_color', value:'#1a0533', label:'IG: Cor Título Como Funciona' },
    { key:'ig_steps_subtitle_color', value:'#64748b', label:'IG: Cor Subtítulo Como Funciona' },
    { key:'ig_step_card_bg', value:'#f8fafc', label:'IG: Cor Fundo Cards Passos' },
    { key:'ig_step_card_border', value:'#e2e8f0', label:'IG: Cor Borda Cards Passos' },
    { key:'ig_step_icon_bg', value:'#22c55e20', label:'IG: Cor Fundo Ícones Passos' },
    { key:'ig_step_icon_color', value:'#22c55e', label:'IG: Cor Ícones Passos' },
    { key:'ig_step_num_color', value:'#22c55e', label:'IG: Cor Números Passos' },
    { key:'ig_step_title_color', value:'#1a0533', label:'IG: Cor Títulos Passos' },
    { key:'ig_step_desc_color', value:'#64748b', label:'IG: Cor Descrições Passos' },
    { key:'ig_step1_icon', value:'🔗', label:'IG: Ícone Passo 1' },
    { key:'ig_step1_title', value:'Crie seu link', label:'IG: Título Passo 1' },
    { key:'ig_step1_desc', value:'Acesse a área do Indique e Ganhe no app ou site da Mundonet e crie seu link personalizado.', label:'IG: Descrição Passo 1' },
    { key:'ig_step2_icon', value:'📤', label:'IG: Ícone Passo 2' },
    { key:'ig_step2_title', value:'Compartilhe', label:'IG: Título Passo 2' },
    { key:'ig_step2_desc', value:'Envie seu link para amigos, familiares e conhecidos pelo WhatsApp, redes sociais ou qualquer canal.', label:'IG: Descrição Passo 2' },
    { key:'ig_step3_icon', value:'🎁', label:'IG: Ícone Passo 3' },
    { key:'ig_step3_title', value:'Ganhe recompensas', label:'IG: Título Passo 3' },
    { key:'ig_step3_desc', value:'Quando seu indicado contratar, vocês dois ganham benefícios! É simples assim.', label:'IG: Descrição Passo 3' },
    { key:'ig_benefits_title', value:'Por que indicar a Mundonet?', label:'IG: Título Benefícios' },
    { key:'ig_benefits_bg', value:'#f0fdf4', label:'IG: Cor Fundo Benefícios' },
    { key:'ig_benefits_title_color', value:'#1a0533', label:'IG: Cor Título Benefícios' },
    { key:'ig_benefit_card_bg', value:'#ffffff', label:'IG: Cor Fundo Cards Benefícios' },
    { key:'ig_benefit_card_border', value:'#dcfce7', label:'IG: Cor Borda Cards Benefícios' },
    { key:'ig_benefit_icon_bg', value:'#22c55e20', label:'IG: Cor Fundo Ícones Benefícios' },
    { key:'ig_benefit_icon_color', value:'#22c55e', label:'IG: Cor Ícones Benefícios' },
    { key:'ig_benefit_title_color', value:'#1a0533', label:'IG: Cor Títulos Benefícios' },
    { key:'ig_benefit_desc_color', value:'#64748b', label:'IG: Cor Descrições Benefícios' },
    { key:'ig_benefit1_icon', value:'🌐', label:'IG: Ícone Benefício 1' },
    { key:'ig_benefit1_title', value:'Internet de Verdade', label:'IG: Título Benefício 1' },
    { key:'ig_benefit1_desc', value:'Fibra óptica 100% com velocidade real e estabilidade garantida.', label:'IG: Descrição Benefício 1' },
    { key:'ig_benefit2_icon', value:'💰', label:'IG: Ícone Benefício 2' },
    { key:'ig_benefit2_title', value:'Preço Justo', label:'IG: Título Benefício 2' },
    { key:'ig_benefit2_desc', value:'Planos a partir de R$ 39,90 sem taxas ocultas e sem surpresas na conta.', label:'IG: Descrição Benefício 2' },
    { key:'ig_benefit3_icon', value:'⚡', label:'IG: Ícone Benefício 3' },
    { key:'ig_benefit3_title', value:'Instalação Rápida', label:'IG: Título Benefício 3' },
    { key:'ig_benefit3_desc', value:'Instalação em até 48 horas com equipe técnica profissional.', label:'IG: Descrição Benefício 3' },
    { key:'ig_benefit4_icon', value:'🎯', label:'IG: Ícone Benefício 4' },
    { key:'ig_benefit4_title', value:'Suporte Dedicado', label:'IG: Título Benefício 4' },
    { key:'ig_benefit4_desc', value:'Suporte técnico rápido e eficiente quando você precisar.', label:'IG: Descrição Benefício 4' },
    { key:'ig_rewards_title', value:'O que você ganha ao indicar?', label:'IG: Título Recompensas' },
    { key:'ig_rewards_desc', value:'A cada amigo que contratar nossa internet, você acumula benefícios exclusivos. Quanto mais indicar, mais ganha!', label:'IG: Descrição Recompensas' },
    { key:'ig_rewards_image', value:'https://mundonetbandalarga.com.br/wp-content/uploads/2026/06/globoplay1.png', label:'IG: Imagem Recompensas' },
    { key:'ig_rewards_bg', value:'#ffffff', label:'IG: Cor Fundo Recompensas' },
    { key:'ig_rewards_title_color', value:'#1a0533', label:'IG: Cor Título Recompensas' },
    { key:'ig_rewards_desc_color', value:'#64748b', label:'IG: Cor Descrição Recompensas' },
    { key:'ig_rewards_item_color', value:'#374151', label:'IG: Cor Itens Recompensas' },
    { key:'ig_rewards_check_color', value:'#22c55e', label:'IG: Cor Check Recompensas' },
    { key:'ig_rewards_item1', value:'Descontos progressivos na mensalidade', label:'IG: Benefício Recompensa 1' },
    { key:'ig_rewards_item2', value:'Acesso a apps de streaming exclusivos', label:'IG: Benefício Recompensa 2' },
    { key:'ig_rewards_item3', value:'Upgrade de plano sem custo adicional', label:'IG: Benefício Recompensa 3' },
    { key:'ig_rewards_item4', value:'Suporte prioritário 24/7', label:'IG: Benefício Recompensa 4' },
    { key:'ig_rewards_item5', value:'Brindes exclusivos a cada indicação', label:'IG: Benefício Recompensa 5' },
    { key:'ig_rewards_btn_text', value:'Quero Participar', label:'IG: Texto Botão Recompensas' },
    { key:'ig_rewards_btn_link', value:'https://api.whatsapp.com/send?phone=559830420030&text=Olá!%20Quero%20saber%20mais%20sobre%20o%20Indique%20e%20Ganhe%20da%20Mundonet.', label:'IG: Link Botão Recompensas' },
    { key:'ig_rewards_btn_bg', value:'#22c55e', label:'IG: Cor Fundo Botão Recompensas' },
    { key:'ig_rewards_btn_color', value:'#ffffff', label:'IG: Cor Texto Botão Recompensas' },
    { key:'ig_cta_title', value:'Comece a indicar agora mesmo!', label:'IG: Título CTA' },
    { key:'ig_cta_desc', value:'Junte-se a milhares de clientes que já estão ganhando com o Indique e Ganhe da Mundonet.', label:'IG: Descrição CTA' },
    { key:'ig_cta_bg', value:'#1a0533', label:'IG: Cor Fundo CTA' },
    { key:'ig_cta_title_color', value:'#ffffff', label:'IG: Cor Título CTA' },
    { key:'ig_cta_desc_color', value:'#a1a1aa', label:'IG: Cor Descrição CTA' },
    { key:'ig_cta_btn_text', value:'Indique e Ganhe Agora', label:'IG: Texto Botão CTA' },
    { key:'ig_cta_btn_link', value:'https://api.whatsapp.com/send?phone=559830420030&text=Olá!%20Quero%20participar%20do%20Indique%20e%20Ganhe%20da%20Mundonet.', label:'IG: Link Botão CTA' },
    { key:'ig_cta_btn_bg', value:'#22c55e', label:'IG: Cor Fundo Botão CTA' },
    { key:'ig_cta_btn_color', value:'#ffffff', label:'IG: Cor Texto Botão CTA' },
  ];
  for (const s of igSettings) {
    if (!db.data.site_settings.find(x => x.key === s.key)) {
      db.data.site_settings.push({ id: db.nextId('site_settings'), ...s });
    }
  }

  // ── Migração: imagens das lojas (Google Play / App Store) ────────
  const appStoreImageSettings = [
    { key:'app_playstore_image', value:'https://mundonetbandalarga.com.br/wp-content/uploads/2025/07/play_store.png', label:'App: Imagem Botão Google Play' },
    { key:'app_appstore_image', value:'https://mundonetbandalarga.com.br/wp-content/uploads/2025/07/apple_store.png', label:'App: Imagem Botão App Store' },
  ];
  for (const s of appStoreImageSettings) {
    if (!db.data.site_settings.find(x => x.key === s.key)) {
      db.data.site_settings.push({ id: db.nextId('site_settings'), ...s });
    }
  }

  // ── Migração: sections_mobile_active ────────────────────────────
  if (!db.data.site_settings.find(x => x.key === 'sections_mobile_active')) {
    const mobileDefault = { hero:true, quicklinks:true, plans:true, benefits:true, app:true, specialties:true, entertainment:true, cta:true, support:true, contact:true };
    db.data.site_settings.push({
      id: db.nextId('site_settings'),
      key: 'sections_mobile_active',
      value: JSON.stringify(mobileDefault),
      label: 'Seções Ativas no Mobile'
    });
  }

  // ── Migração: Empresas (Para Empresas) ──────────────────────────
  const empSettings = [
    // Hero
    { key:'emp_hero_bg', value:'#1a0533', label:'Emp: Fundo Hero' },
    { key:'emp_page_bg', value:'', label:'Emp: Cor Fundo Página' },
    { key:'emp_hero_height', value:'600', label:'Emp: Altura Hero (px)' },
    { key:'emp_hero_title', value:'Conectividade corporativa de alto nível', label:'Emp: Título Hero' },
    { key:'emp_hero_subtitle', value:'Soluções de internet dedicadas para empresas que precisam de performance, segurança e suporte especializado.', label:'Emp: Subtítulo Hero' },
    { key:'emp_hero_image', value:'https://mundonetbandalarga.com.br/wp-content/uploads/2026/06/area-top_700.png', label:'Emp: Imagem Hero' },
    { key:'emp_hero_btn1_text', value:'Fale Conosco', label:'Emp: Texto Botão 1' },
    { key:'emp_hero_btn1_link', value:'https://api.whatsapp.com/send?phone=559830420030&text=Olá!%20Vim%20pela%20página%20de%20empresas%20e%20gostaria%20de%20mais%20informações.', label:'Emp: Link Botão 1' },
    { key:'emp_hero_btn1_bg', value:'#22c55e', label:'Emp: Cor Botão 1' },
    { key:'emp_hero_btn1_color', value:'#ffffff', label:'Emp: Cor Texto Botão 1' },
    { key:'emp_hero_btn2_text', value:'Ver Planos', label:'Emp: Texto Botão 2' },
    { key:'emp_hero_btn2_link', value:'#emp-planos', label:'Emp: Link Botão 2' },
    { key:'emp_hero_btn2_bg', value:'rgba(255,255,255,0.15)', label:'Emp: Cor Botão 2' },
    { key:'emp_hero_btn2_color', value:'#ffffff', label:'Emp: Cor Texto Botão 2' },
    { key:'emp_hero_title_color', value:'#ffffff', label:'Emp: Cor Título Hero' },
    { key:'emp_hero_subtitle_color', value:'#a1a1aa', label:'Emp: Cor Subtítulo Hero' },
    // Planos
    { key:'emp_plans_enabled', value:'true', label:'Emp: Ativar Seção Planos' },
    { key:'emp_plans_title', value:'Planos sob medida para sua empresa', label:'Emp: Título Planos' },
    { key:'emp_plans_subtitle', value:'Temos soluções para qualquer que seja sua necessidade', label:'Emp: Subtítulo Planos' },
    { key:'emp_plans_bg', value:'#f8fafc', label:'Emp: Fundo Planos' },
    { key:'emp_plans_title_color', value:'#1a0533', label:'Emp: Cor Título Planos' },
    { key:'emp_plans_subtitle_color', value:'#64748b', label:'Emp: Cor Subtítulo Planos' },
    // Benefícios
    { key:'emp_benefits_title', value:'Benefícios e vantagens para sua empresa', label:'Emp: Título Benefícios' },
    { key:'emp_benefits_items', value:'[{"icon":"📈","title":"Planos flexíveis e escaláveis","desc":"Opções que crescem junto com o seu negócio, sem complicações."},{"icon":"🌐","title":"Conectividade para todos","desc":"Planos exclusivos para empresas, garantindo maior desempenho."},{"icon":"🛡️","title":"Suporte Prioritário 24/7","desc":"Atendimento especializado para resolver qualquer necessidade."},{"icon":"🔒","title":"Segurança reforçada","desc":"Proteção contra ataques e segurança extra para os dados da sua empresa."}]', label:'Emp: Itens Benefícios' },
    { key:'emp_benefits_bg', value:'#ffffff', label:'Emp: Fundo Benefícios' },
    { key:'emp_benefits_title_color', value:'#1a0533', label:'Emp: Cor Título Benefícios' },
    { key:'emp_benefit1_icon', value:'📈', label:'Emp: Ícone Benefício 1' },
    { key:'emp_benefit1_title', value:'Planos flexíveis e escaláveis', label:'Emp: Título Benefício 1' },
    { key:'emp_benefit1_desc', value:'Opções que crescem junto com o seu negócio, sem complicações.', label:'Emp: Descrição Benefício 1' },
    { key:'emp_benefit2_icon', value:'🌐', label:'Emp: Ícone Benefício 2' },
    { key:'emp_benefit2_title', value:'Conectividade para todos', label:'Emp: Título Benefício 2' },
    { key:'emp_benefit2_desc', value:'Planos exclusivos para empresas, garantindo maior desempenho.', label:'Emp: Descrição Benefício 2' },
    { key:'emp_benefit3_icon', value:'🛡️', label:'Emp: Ícone Benefício 3' },
    { key:'emp_benefit3_title', value:'Suporte Prioritário 24/7', label:'Emp: Título Benefício 3' },
    { key:'emp_benefit3_desc', value:'Atendimento especializado para resolver qualquer necessidade.', label:'Emp: Descrição Benefício 3' },
    { key:'emp_benefit4_icon', value:'🔒', label:'Emp: Ícone Benefício 4' },
    { key:'emp_benefit4_title', value:'Segurança reforçada', label:'Emp: Título Benefício 4' },
    { key:'emp_benefit4_desc', value:'Proteção contra ataques e segurança extra para os dados da sua empresa.', label:'Emp: Descrição Benefício 4' },
    { key:'emp_benefit_card_bg', value:'#ffffff', label:'Emp: Fundo Cards Benefícios' },
    { key:'emp_benefit_card_border', value:'#e2e8f0', label:'Emp: Borda Cards Benefícios' },
    { key:'emp_benefit_icon_bg', value:'#005CFF20', label:'Emp: Fundo Ícones Benefícios' },
    { key:'emp_benefit_icon_color', value:'#005CFF', label:'Emp: Cor Ícones Benefícios' },
    { key:'emp_benefit_title_color', value:'#1a0533', label:'Emp: Cor Título Benefícios Cards' },
    { key:'emp_benefit_desc_color', value:'#64748b', label:'Emp: Cor Descrição Benefícios' },
    // Serviços
    { key:'emp_services_title', value:'Serviços dedicados e exclusivos', label:'Emp: Título Serviços' },
    { key:'emp_services_items', value:'[{"icon":"📥","title":"Download e upload garantidos","desc":"Contrate o plano desejado e tenha garantia de download e upload simétricos."},{"icon":"🌐","title":"IP Dedicado","desc":"Tenha um IP exclusivo, garantindo melhor desempenho, segurança e controle sobre a sua rede."},{"icon":"🛡️","title":"Segurança de Rede","desc":"Proteção contra ameaças digitais com firewall e sistemas de segurança avançados."},{"icon":"🔗","title":"Intranet Corporativa","desc":"Rede interna exclusiva para sua empresa com alta velocidade e privacidade."},{"icon":"🔐","title":"VPN Corporativa","desc":"Conexão segura e criptografada para acesso remoto aos sistemas da empresa."},{"icon":"☁️","title":"Backup em Nuvem","desc":"Armazenamento seguro e escalável para proteger os dados da sua empresa."}]', label:'Emp: Itens Serviços' },
    { key:'emp_services_subtitle', value:'Serviços disponíveis em nossos planos empresariais', label:'Emp: Subtítulo Serviços' },
    { key:'emp_services_bg', value:'#f0f4ff', label:'Emp: Fundo Serviços' },
    { key:'emp_services_title_color', value:'#1a0533', label:'Emp: Cor Título Serviços' },
    { key:'emp_services_subtitle_color', value:'#64748b', label:'Emp: Cor Subtítulo Serviços' },
    { key:'emp_service1_icon', value:'📥', label:'Emp: Ícone Serviço 1' },
    { key:'emp_service1_title', value:'Download e upload garantidos', label:'Emp: Título Serviço 1' },
    { key:'emp_service1_desc', value:'Contrate o plano desejado e tenha garantia de download e upload simétricos.', label:'Emp: Descrição Serviço 1' },
    { key:'emp_service2_icon', value:'🌐', label:'Emp: Ícone Serviço 2' },
    { key:'emp_service2_title', value:'IP Dedicado', label:'Emp: Título Serviço 2' },
    { key:'emp_service2_desc', value:'Tenha um IP exclusivo, garantindo melhor desempenho, segurança e controle sobre a sua rede.', label:'Emp: Descrição Serviço 2' },
    { key:'emp_service3_icon', value:'🛡️', label:'Emp: Ícone Serviço 3' },
    { key:'emp_service3_title', value:'Segurança de Rede', label:'Emp: Título Serviço 3' },
    { key:'emp_service3_desc', value:'Proteção contra ameaças digitais com firewall e sistemas de segurança avançados.', label:'Emp: Descrição Serviço 3' },
    { key:'emp_service4_icon', value:'🔗', label:'Emp: Ícone Serviço 4' },
    { key:'emp_service4_title', value:'Intranet Corporativa', label:'Emp: Título Serviço 4' },
    { key:'emp_service4_desc', value:'Rede interna exclusiva para sua empresa com alta velocidade e privacidade.', label:'Emp: Descrição Serviço 4' },
    { key:'emp_service5_icon', value:'🔐', label:'Emp: Ícone Serviço 5' },
    { key:'emp_service5_title', value:'VPN Corporativa', label:'Emp: Título Serviço 5' },
    { key:'emp_service5_desc', value:'Conexão segura e criptografada garantindo privacidade e proteção dos dados.', label:'Emp: Descrição Serviço 5' },
    { key:'emp_service6_icon', value:'☁️', label:'Emp: Ícone Serviço 6' },
    { key:'emp_service6_title', value:'Backup em Nuvem', label:'Emp: Título Serviço 6' },
    { key:'emp_service6_desc', value:'Solução escalável e confiável para manter a continuidade dos seus negócios.', label:'Emp: Descrição Serviço 6' },
    { key:'emp_service_card_bg', value:'#ffffff', label:'Emp: Fundo Cards Serviços' },
    { key:'emp_service_card_border', value:'#dbeafe', label:'Emp: Borda Cards Serviços' },
    { key:'emp_service_icon_bg', value:'#005CFF20', label:'Emp: Fundo Ícones Serviços' },
    { key:'emp_service_icon_color', value:'#005CFF', label:'Emp: Cor Ícones Serviços' },
    { key:'emp_service_title_color', value:'#1a0533', label:'Emp: Cor Título Serviços Cards' },
    { key:'emp_service_desc_color', value:'#64748b', label:'Emp: Cor Descrição Serviços' },
    // CTA
    { key:'emp_cta_bg', value:'#1a0533', label:'Emp: Fundo CTA' },
    { key:'emp_cta_title', value:'Faça parte deste movimento, assine um plano empresarial!', label:'Emp: Título CTA' },
    { key:'emp_cta_desc', value:'Soluções completas em conectividade para impulsionar o seu negócio.', label:'Emp: Descrição CTA' },
    { key:'emp_cta_title_color', value:'#ffffff', label:'Emp: Cor Título CTA' },
    { key:'emp_cta_desc_color', value:'#a1a1aa', label:'Emp: Cor Descrição CTA' },
    { key:'emp_cta_btn_text', value:'Fale com nosso time', label:'Emp: Texto Botão CTA' },
    { key:'emp_cta_btn_link', value:'https://api.whatsapp.com/send?phone=559830420030&text=Olá!%20Vim%20pela%20página%20de%20empresas%20e%20gostaria%20de%20contratar%20um%20plano%20empresarial.', label:'Emp: Link Botão CTA' },
    { key:'emp_cta_btn_bg', value:'#22c55e', label:'Emp: Cor Botão CTA' },
    { key:'emp_cta_btn_color', value:'#ffffff', label:'Emp: Cor Texto Botão CTA' },
  ];
  for (const s of empSettings) {
    if (!db.data.site_settings.find(x => x.key === s.key)) {
      db.data.site_settings.push({ id: db.nextId('site_settings'), ...s });
    }
  }

  await db.write();
  console.log('✅ Banco de dados pronto (mundonet-db.json)');
  return db;
}

export { db };
