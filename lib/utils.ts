import dayjs from "dayjs";
import * as Icons from '@expo/vector-icons';

export const formatCurrency = (value: number, currency = "USD"): string => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return value.toFixed(2);
  }
};

export const formatSubscriptionDateTime = (value?: string): string => {
  if (!value) return "Not provided";
  const parsedDate = dayjs(value);
  return parsedDate.isValid() ? parsedDate.format("MM/DD/YYYY") : "Not provided";
};

export const formatStatusLabel = (value?: string): string => {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

type IconName = React.ComponentProps<typeof Icons.Feather>['name'];

export const getIconForSubscription = (name: string): IconName => {
  const lowerName = name.toLowerCase();
  
  // Entertainment & Streaming
  if (lowerName.includes('youtube')) return 'youtube';
  if (lowerName.includes('netflix')) return 'tv';
  if (lowerName.includes('spotify')) return 'music';
  if (lowerName.includes('apple') && lowerName.includes('music')) return 'headphones';
  if (lowerName.includes('disney')) return 'film';
  if (lowerName.includes('hbo') || lowerName.includes('max')) return 'monitor';
  if (lowerName.includes('prime') || lowerName.includes('amazon')) return 'shopping-bag';
  if (lowerName.includes('hulu')) return 'film';
  if (lowerName.includes('twitch')) return 'twitch';
  
  // AI Tools
  if (lowerName.includes('chatgpt') || lowerName.includes('openai')) return 'cpu';
  if (lowerName.includes('claude')) return 'message-circle';
  if (lowerName.includes('midjourney')) return 'image';
  if (lowerName.includes('dalle')) return 'camera';
  if (lowerName.includes('copilot') || lowerName.includes('github')) return 'github';
  if (lowerName.includes('perplexity')) return 'search';
  if (lowerName.includes('gemini')) return 'zap';
  
  // Developer Tools
  if (lowerName.includes('github')) return 'github';
  if (lowerName.includes('gitlab')) return 'git-branch';
  if (lowerName.includes('figma')) return 'figma';
  if (lowerName.includes('vscode') || lowerName.includes('visual studio')) return 'code';
  if (lowerName.includes('jetbrains')) return 'terminal';
  if (lowerName.includes('mongodb')) return 'database';
  if (lowerName.includes('aws')) return 'cloud';
  if (lowerName.includes('azure')) return 'cloud';
  if (lowerName.includes('google cloud')) return 'cloud';
  
  // Design
  if (lowerName.includes('adobe')) return 'layers';
  if (lowerName.includes('photoshop')) return 'camera';
  if (lowerName.includes('illustrator')) return 'pen-tool';
  if (lowerName.includes('canva')) return 'layout';
  if (lowerName.includes('procreate')) return 'smartphone';
  if (lowerName.includes('sketch')) return 'pen-tool';
  
  // Productivity
  if (lowerName.includes('notion')) return 'book';
  if (lowerName.includes('slack')) return 'message-square';
  if (lowerName.includes('zoom')) return 'video';
  if (lowerName.includes('teams')) return 'users';
  if (lowerName.includes('trello')) return 'grid';
  if (lowerName.includes('asana')) return 'check-square';
  if (lowerName.includes('dropbox')) return 'cloud';
  if (lowerName.includes('drive') || lowerName.includes('google drive')) return 'hard-drive';
  if (lowerName.includes('icloud')) return 'cloud';
  if (lowerName.includes('onedrive')) return 'cloud';
  
  // Social Media
  if (lowerName.includes('linkedin')) return 'linkedin';
  if (lowerName.includes('twitter') || lowerName.includes('x')) return 'twitter';
  if (lowerName.includes('instagram')) return 'instagram';
  if (lowerName.includes('facebook')) return 'facebook';
  if (lowerName.includes('discord')) return 'message-circle'; 
  if (lowerName.includes('reddit')) return 'message-circle';
  if (lowerName.includes('tiktok')) return 'video';
  if (lowerName.includes('snapchat')) return 'camera';
  
  // Gaming
  if (lowerName.includes('xbox') || lowerName.includes('game pass')) return 'radio';
  if (lowerName.includes('playstation')) return 'radio';
  if (lowerName.includes('nintendo')) return 'radio';
  if (lowerName.includes('steam')) return 'radio';
  if (lowerName.includes('game')) return 'radio';
  if (lowerName.includes('epic')) return 'radio';
  
  // News & Reading
  if (lowerName.includes('medium')) return 'book-open';
  if (lowerName.includes('substack')) return 'mail';
  if (lowerName.includes('nytimes')) return 'book-open';
  if (lowerName.includes('news')) return 'file-text';
  if (lowerName.includes('bloomberg')) return 'briefcase';
  if (lowerName.includes('wsj') || lowerName.includes('wall street journal')) return 'briefcase';
  
  // Fitness & Health
  if (lowerName.includes('fitbit')) return 'activity';
  if (lowerName.includes('strava')) return 'map-pin';
  if (lowerName.includes('headspace')) return 'smile';
  if (lowerName.includes('calm')) return 'moon';
  if (lowerName.includes('fitness')) return 'activity';
  if (lowerName.includes('gym')) return 'activity';
  if (lowerName.includes('yoga')) return 'activity';
  if (lowerName.includes('meditation')) return 'moon';
  
  // Music & Audio
  if (lowerName.includes('pandora')) return 'radio';
  if (lowerName.includes('tidal')) return 'music';
  if (lowerName.includes('deezer')) return 'music';
  if (lowerName.includes('soundcloud')) return 'headphones';
  if (lowerName.includes('audiobook')) return 'headphones';
  if (lowerName.includes('podcast')) return 'mic';
  
  // Cloud Storage
  if (lowerName.includes('box')) return 'box';
  if (lowerName.includes('backblaze')) return 'cloud';
  if (lowerName.includes('pcloud')) return 'cloud';
  
  // VPN & Security
  if (lowerName.includes('nordvpn')) return 'shield';
  if (lowerName.includes('expressvpn')) return 'shield';
  if (lowerName.includes('vpn')) return 'shield';
  if (lowerName.includes('antivirus')) return 'shield';
  if (lowerName.includes('password')) return 'lock';
  if (lowerName.includes('1password')) return 'lock';
  if (lowerName.includes('lastpass')) return 'lock';
  if (lowerName.includes('bitwarden')) return 'lock';
  
  // Learning & Education
  if (lowerName.includes('coursera')) return 'book-open';
  if (lowerName.includes('udemy')) return 'book-open';
  if (lowerName.includes('skillshare')) return 'book-open';
  if (lowerName.includes('brilliant')) return 'zap';
  if (lowerName.includes('duolingo')) return 'message-circle';
  if (lowerName.includes('masterclass')) return 'video';
  
  // Default fallback
  return 'package';
};