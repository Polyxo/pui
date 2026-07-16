// Shared public component types. This is a TypeScript source module so the
// declaration build reliably includes it for package consumers.
declare type ScreenSize = "full" | "lg" | "md" | "sm";

declare type StatusKind = "info" | "error" | "warning" | "success";

declare type ButtonKind =
  | "primary"
  | "secondary"
  | "tertiary"
  | "accent"
  | "danger"
  | "danger--primary"
  | "danger--secondary"
  | "ghost"
  | "inverse--primary"
  | "inverse"
  | "navigation";

declare type InputModes =
  | "none"
  | "text"
  | "tel"
  | "url"
  | "email"
  | "numeric"
  | "decimal"
  | "search"
  | "password"
  | undefined;

declare interface IIcon {
  name?: string;
  tags?: string;
  styles?: string;
  width?: string;
  height?: string;
  viewBox: string;
  svgData: React.ReactNode;
}

declare type CardKind = "simple-card" | "overlay";

declare type HeroKind =
  | "landscape"
  | "landscape-light"
  | "emergencies"
  | "split"
  | "hero"
  | "splash"
  | "splash-image"
  | "splash-compact"
  | "related";

declare type NotificationType = "toast" | "inline";
declare type NotificationKind =
  | "error"
  | "success"
  | "warning"
  | "warning-alt"
  | "info";

declare type TagType = "info" | "error" | "success" | "warning" | "custom";

declare type TextKind =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "title"
  | "subtitle"
  | "story-title"
  | "story-subtitle"
  | "story-sub-title"
  | "story-italic"
  | "story-h1"
  | "story-h2"
  | "story-h3"
  | "story-h4"
  | "story-h5"
  | "story-h6"
  | "body-regular"
  | "helper"
  | "input"
  | "bold"
  | "strong"
  | "inline-highlight"
  | "a"
  | "p"
  | "i"
  | "sup"
  | "caption"
  | "code";

declare type Spacing =
  | "none"
  | "3xs"
  | "2xs"
  | "2x"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl";

declare type Placement =
  | "top"
  | "top-start"
  | "top-end"
  | "right"
  | "right-start"
  | "right-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end";

declare type UnitType =
  | "none"
  | "usd"
  | "partners"
  | "beneficiaries"
  | "households"
  | "months"
  | "mt"
  | "metricTons"
  | "kg"
  | "num"
  | "yearMonth"
  | "level"
  | "people"
  | "countries"
  | "percentage";

export {
  ScreenSize,
  StatusKind,
  IIcon,
  ButtonKind,
  InputModes,
  CardKind,
  HeroKind,
  NotificationType,
  NotificationKind,
  TagType,
  TextKind,
  Spacing,
  Placement,
  UnitType,
};
