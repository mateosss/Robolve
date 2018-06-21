var Icon = Text.extend({
  icons: {
    '': '',
    'airballoon': '\ue800',
    'arrow-left': '\ue801',
    'arrow-right': '\ue802',
    'castle': '\ue803',
    'chart-donut-variant': '\ue804',
    'check': '\ue805',
    'chevron-down': '\ue806',
    'chevron-up': '\ue807',
    'close': '\ue808',
    'cloud': '\ue809',
    'coin': '\ue80a',
    'coins': '\ue80b',
    'currency-eth': '\ue80c',
    'database': '\ue80d',
    'delete': '\ue80e',
    'diamond': '\ue80f',
    'dna': '\ue810',
    'fast-forward': '\ue811',
    'fire': '\ue812',
    'flash': '\ue813',
    'flask': '\ue814',
    'google-circles': '\ue815',
    'hexagon': '\ue816',
    'hexagon-outline': '\ue817',
    'nfc-variant': '\ue818',
    'nuke': '\ue819',
    'pause': '\ue81a',
    'plus': '\ue81b',
    'rewind': '\ue81c',
    'robot': '\ue81d',
    'skip-forward': '\ue81e',
    'target': '\ue81f',
    'terrain': '\ue820',
    'water': '\ue821',
    'weather-windy': '\ue822',
  },

  icon: null,
  ctor: function(options) {
    this.icon = this.icon || {
      icon: "robot",
    };
    options.text = this.icons[this.icon.icon];
    options.fontName = "icons";
    this._super(options);
  },
  setup: function(options) {
    this.icon.icon = options.icon !== undefined ? options.icon : this.icon.icon;
    options.text = this.icons[this.icon.icon];
    if (options.text === undefined) throw(_.format("{} is not a valid icon name", this.icon.icon));
    this._super(options);
  },
  toString: () => "Icon",
});
