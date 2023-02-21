import { render } from '../utils';
import { Accordion, AccordionProps, useAccordionProvider } from '../../';

jest.mock('../../hooks/useAccordionProvider');

test('Accordion should forward props to useAccordionProvider', () => {
  const props: AccordionProps = {
    allowMultiple: true,
    initialEntered: true,
    mountOnEnter: false,
    unmountOnExit: false,
    transition: true,
    transitionTimeout: 300,
    onStateChange: jest.fn()
  };
  render(<Accordion {...props}>Accordion</Accordion>);
  expect(useAccordionProvider).toHaveBeenCalledWith(props);
});
