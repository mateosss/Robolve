var Icon = Text.extend({
  icons: {
    '': '',
    'airballoon': '\ue800',
    'arrow-left': '\ue801',
    'arrow-right': '\ue802',
    'castle': '\ue803',
    'chart-donut-variant': '\ue804',
    'cloud': '\ue805',
    'coin': '\ue806',
    'coins': '\ue807',
    'currency-eth': '\ue808',
    'database': '\ue809',
    'diamond': '\ue80a',
    'dna': '\ue80b',
    'fast-forward': '\ue80c',
    'flash': '\ue80d',
    'flask': '\ue80e',
    'google-circles': '\ue80f',
    'hexagon': '\ue810',
    'hexagon-outline': '\ue811',
    'nfc-variant': '\ue812',
    'nuke': '\ue813',
    'pause': '\ue814',
    'plus': '\ue815',
    'rewind': '\ue816',
    'robot': '\ue817',
    'skip-forward': '\ue818',
    'target': '\ue819',
    'terrain': '\ue81a',
    'weather-windy': '\ue81b',
    'check': '\ue81c',
    'close': '\ue81d',
    'fire': '\ue81e',
    'water': '\ue81f',
    'chevron-down': '\ue820',
    'chevron-up': '\ue821',
  },
  icon: null,
  ctor: function(options) {
    this.icon = this.icon || {
      icon: "robot",
    };
    options.text = this.icons[this.icon.icon];
    options.font = r.fonts.icons;
    this._super(options);
  },
  setup: function(options) {
    this.icon.icon = options.icon !== undefined ? options.icon : this.icon.icon;
    options.text = this.icons[this.icon.icon];
    if (options.text === undefined) throw(_.format("{} is not a valid icon name", this.icon.icon));
    if (cc.sys.isNative && !options.right && !this.displayManager.calc(this.displayManager.right)) options.right = "8px"; // TODO Pretty weird android icon fix
    this._super(options);
  },
  toString: () => "Icon",
});
