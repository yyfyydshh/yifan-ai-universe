import type {ZoneId} from './world-data';

export const worldReactions:Record<ZoneId,{person:string;cat:string;caption:string;foot:number;effect:string}>={
  work:{person:'typing',cat:'watching-screen',caption:'把一个小想法做出来，小牛也来帮忙。',foot:1163/1254,effect:'·'},
  writing:{person:'writing',cat:'playing-with-pen',caption:'记下今天。小牛已经挑好了它的笔。',foot:1141/1254,effect:'✎'},
  music:{person:'listening',cat:'keeping-time',caption:'一起听一小段，让节奏慢下来。',foot:1194/1254,effect:'♪'},
  games:{person:'playing',cat:'rolling-die',caption:'我来操作手柄，小牛负责掷骰子。',foot:1195/1254,effect:'·'},
  films:{person:'watching-film',cat:'looking-up',caption:'准备好爆米花，陪我们看个好故事。',foot:1174/1254,effect:'✦'},
  thoughts:{person:'thinking',cat:'resting',caption:'在这里慢慢想，小牛先歇一会儿。',foot:1202/1254,effect:'·'},
  stuff:{person:'exploring-keepsakes',cat:'peeking-from-box',caption:'翻翻小收藏。纸箱已经被小牛占领了。',foot:1174/1254,effect:'✧'},
};
