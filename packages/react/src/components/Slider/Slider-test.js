import React from 'react';
import Slider from '.';
import SliderSkeleton from './Slider.Skeleton';
import { mount, shallow } from 'enzyme';
import 'requestanimationframe';

describe('Slider', () => {
  describe('Renders as expected', () => {
    const mockFn = jest.fn();
    const wrapper = mount(
      <Slider
        id="slider"
        className="extra-class"
        value={50}
        min={0}
        max={100}
        step={1}
        onChange={mockFn}
      />
    );

    it('renders children as expected', () => {
      expect(wrapper.length).toBe(1);
    });

    it('has the expected classes', () => {
      expect(wrapper.find('.wfp--slider').length).toBe(1);
    });

    it('renders extra classes passed in via className', () => {
      expect(wrapper.find('.wfp--slider').hasClass('extra-class')).toEqual(
        true
      );
    });

    it('can be disabled', () => {
      wrapper.setProps({ disabled: true });
      expect(wrapper.props().disabled).toEqual(true);
    });

    it('can set value via props', () => {
      wrapper.setProps({ value: 55 });
      expect(wrapper.props().value).toEqual(55);
    });
  });

  describe('Supporting label', () => {
    it('concatenates the value and the label by default', () => {
      const wrapper = mount(
        <Slider
          id="slider-1"
          min={0}
          minLabel="min"
          max={100}
          maxLabel="max"
          value={0}
        />
      );
      expect(wrapper.find('.wfp--slider__range-label').first().text()).toBe(
        '0min'
      );
      expect(wrapper.find('.wfp--slider__range-label').last().text()).toBe(
        '100max'
      );
    });

    it('supports custom formatting of the label', () => {
      const wrapper = mount(
        <Slider
          id="slider-2"
          min={0}
          minLabel="min"
          max={100}
          maxLabel="max"
          formatLabel={(value, label) => `${value}-${label}`}
          value={0}
        />
      );
      expect(wrapper.find('.wfp--slider__range-label').first().text()).toBe(
        '0-min'
      );
      expect(wrapper.find('.wfp--slider__range-label').last().text()).toBe(
        '100-max'
      );
    });
  });

  describe('updatePosition method', () => {
    const mockFn = jest.fn();
    const wrapper = mount(
      <Slider
        id="slider"
        className="extra-class"
        value={50}
        min={0}
        max={100}
        step={1}
        onChange={mockFn}
      />
    );

    // it('sets correct state from event with a right/up keydown', () => {
    //   const evt = {
    //     type: 'keydown',
    //     which: '38',
    //   };
    //   console.log(wrapper.instance())
    //   wrapper.update(evt);
    //   expect(mockFn).lastCalledWith(51);
    //   expect(wrapper.state().value).toEqual(51);
    // });

    // it('sets correct state from event with a left/down keydown', () => {
    //   const evt = {
    //     type: 'keydown',
    //     which: '40',
    //   };
    //   wrapper.instance().updatePosition(evt);
    //   expect(mockFn).lastCalledWith(50);
    //   expect(wrapper.state().value).toEqual(50);
    // });

    // it('sets correct state from event with a clientX', () => {
    //   const evt = {
    //     type: 'click',
    //     clientX: '1000',
    //   };
    //   wrapper.instance().updatePosition(evt);
    //   expect(mockFn).lastCalledWith(100);
    //   expect(wrapper.state().value).toEqual(100);
    // });
  });
});

describe('SliderSkeleton', () => {
  describe('Renders as expected', () => {
    const wrapper = shallow(<SliderSkeleton />);

    const slider = wrapper.find('.wfp--slider-container');

    it('Has the expected classes', () => {
      expect(slider.hasClass('wfp--skeleton')).toEqual(true);
    });
  });
});
