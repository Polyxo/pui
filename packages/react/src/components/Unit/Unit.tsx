import * as React from 'react';
import scaleLookup from './scaleLookup';

import {
  Countries,
  Usd,
  Partners,
  Beneficiaries,
  Households,
  People,
  Months,
  Level,
  Mt,
  Kg,
  MetricTons,
  Trips,
  None,
  Num,
  Percentage,
  YearMonth,
} from './UnitList';
import useSettings from '../../hooks/useSettings';
// All Unit Components together in <Unit type="Unitname" />

interface UnitProps extends React.ComponentPropsWithoutRef<'div'> {
  /**
    The value which should be displayed
  */
  children: string | number;
  /**
      Only used for type Percentage will divide value/from string, float
    */
  from?: string | number;
  /**
      The interface of the input value
    */
  input?: string;
  /**
   * Display zero values to be displayed
   */
  showZero: boolean;
  /**
      Hide the Unit if it's value is zero.
    */
  hideEmpty: boolean;
  /**
      The minimum number of fraction digits to use. Possible values are from 0 to 20. Only used on numeric types
    */
  minimumFractionDigits?: number;
  /**
      A value between 1-21, The maximum number of significant digits to use. Possible values are from 1 to 21; the default is minimumSignificantDigits.
    */
  maximumSignificantDigits?: number;

  output?: string;

  string?: boolean;
  localeStringLanguage?: string;
  maximumFractionDigits?: number;
  textAnchor?: string;

  /**
   * A string with a BCP 47 language code, or an array of language codes. For the general form and interpretation of the locale argument see the [toLocaleString on developer.mozilla.org](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString) page.
   */
  locale?: string;

  /**
      Setup the Unit
    */
  setup?: boolean;
  /**
      Render output as svg text
    */
  svg?: boolean;
  /**
      The unit type  */
  type:
    | 'none'
    | 'usd'
    | 'partners'
    | 'beneficiaries'
    | 'households'
    | 'months'
    | 'mt'
    | 'metricTons'
    | 'kg'
    | 'num'
    | 'yearMonth'
    | 'level'
    | 'people'
    | 'countries'
    | 'percentage';
}

const components = {
  Usd,
  Partners,
  Beneficiaries,
  Households,
  Months,
  Mt,
  Kg,
  MetricTons,
  Num,
  Level,
  None,
  Trips,
  Countries,
  People,
  Percentage,
  YearMonth,
};

/** The Unit component method returns a component with a language and unit sensitive representation of this number based on [Numbers and Unit from the Editorial Guidelines](https://cdn.wfp.org/guides/editorial/content/numbers-and-units/) the [Numbers and Units Reference on developer.mozilla.org](http://cdn.wfp.org/guides/editorial/content/numbers-and-units). */

const Unit: React.FC<UnitProps> = (props) => {
  const { prefix } = useSettings();

  const {
    className,
    output,
    string,
    textAnchor,
    localeStringLanguage = 'en-EN',
    type = 'none',
    setup,
  } = props;
  const typeEl = props.type.charAt(0).toUpperCase() + props.type.slice(1);
  const Unit = components[typeEl];
  //const unitHideClass = setup && setup.hideUnit ? 'wfp--unit--hide' : '';
  const textAnchorCalc = textAnchor ? textAnchor : 'start';
  const unitClassName = type ? `${prefix}--unit--${type.toLowerCase()}` : '';

  const outputClassName =
    output && scaleLookup[output] ? `${prefix}--unit--${output}` : '';
  const setupClassName = setup ? `${prefix}--unit--${setup}` : '';
  const classNameCalc = `${prefix}--unit ${className} ${unitClassName} ${outputClassName} ${setupClassName}`;

  if (string) {
    return Unit(props);
  }

  if (Unit === undefined) {
    //  console.warn(`The unit "${type}" is undefined`);
    return null;
  }

  return (
    <Unit
      {...props}
      className={classNameCalc}
      textAnchor={textAnchorCalc}
      localeStringLanguage={localeStringLanguage}
    />
  );
};

export default Unit;
