// Rating primitives (DESIGN_PLAN §4): two distinct widgets kept separate on
// purpose — StarPicker is the 0.5-step star INPUT (preserves its
// star-{i}-half/full testIDs), RatingBar is the multi-source consensus DISPLAY
// (with its no-ratings empty guard). Re-exported here so screens import both
// from the ui kit; their APIs and testIDs are unchanged.
export { StarPicker } from '../StarPicker';
export { RatingBar, type SourceScores } from '../RatingBar';
