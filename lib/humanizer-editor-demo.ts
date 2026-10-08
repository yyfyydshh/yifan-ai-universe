/** Authored, fixed literary fragments for the portfolio demo; no real author's work. */
export type LiteraryFragment = {
  id: string;
  label: string;
  title: string;
  lead: string;
  protectedText: string;
  extra: string;
  profile: string;
  reason: string;
  lockReason: string;
};

export const literaryFragments: readonly LiteraryFragment[] = [
  {
    id: "image", label: "留白", title: "雨后的窗台",
    lead: "灯泡在雨里摇。", protectedText: "窗台上的薄荷叶向里卷。",
    extra: "这预示着她即将放弃旧日生活。",
    profile: "具体物件，短句，保留留白。",
    reason: "删去替读者解释象征的句子，薄荷叶和原有留白仍在。",
    lockReason: "薄荷叶是这段的核心意象，不能换成别的物件。",
  },
  {
    id: "dialogue", label: "对白", title: "门口的停顿",
    lead: "她握着门把手，停了一会儿。", protectedText: "“别等我。”",
    extra: "这句话的意思是，她一定不会再回来。",
    profile: "用动作和对白叙事，不替人物解释。",
    reason: "删去把对白解释成唯一答案的句子，让人物原话自己说话。",
    lockReason: "“别等我。”是关键对白，不能改成“我会回来”。",
  },
  {
    id: "ending", label: "结尾", title: "没有再响的门",
    lead: "屋里只剩下钟摆的声音。", protectedText: "她把钥匙放回桌上，门没有再响。",
    extra: "故事到这里结束了，她做出了最正确的选择。",
    profile: "用物件和停顿收尾，不补写结论。",
    reason: "删去替作者作结的评判，人物动作与开放结尾保持原样。",
    lockReason: "不能追加“离开才是唯一答案”，替作者确定结局。",
  },
];

export const fragmentOriginal = (fragment: LiteraryFragment) =>
  `${fragment.lead}${fragment.protectedText}${fragment.extra}`;
export const fragmentEdited = (fragment: LiteraryFragment) =>
  `${fragment.lead}${fragment.protectedText}`;
