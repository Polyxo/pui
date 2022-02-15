import React from 'react';
import FileUploader, {
  FileUploaderButton /*, Filename*/,
} from '../FileUploader';
import FileUploaderSkeleton from '../FileUploader/FileUploader.Skeleton';
import { mount, shallow } from 'enzyme';

/*
describe('Filename', () => {
  const mountWrapper = mount(<Filename name={'trees.jpg'} />);

  describe('click on edit icon (close--solid)', () => {
    it('should have a click event', () => {
      const onClick = jest.fn();
      mountWrapper.setProps({ onClick, status: 'edit' });
      mountWrapper.find('Icon').simulate('click');
      expect(onClick).toBeCalled();
    });
  });
});*/

describe('FileUploaderButton', () => {
  const button = <FileUploaderButton className="extra-class" labelText="Add file" />;
  const mountWrapper = mount(button);
  const shallowWrapper = mount(button);

  describe('Renders as expected with default props', () => {
    it('renders with expected className', () => {
      expect(mountWrapper.find('label').hasClass('wfp--btn')).toBe(true);
    });

    it('renders with given className', () => {
      expect(mountWrapper.hasClass('extra-class')).toBe(true);
    });

    it('renders with expected button className', () => {
      expect(mountWrapper.find('.wfp--btn--primary').exists()).toBe(true);
    });

    // it('does not have default role', () => {
    //   expect(mountWrapper.props().role).toEqual('button');
    // });

    it('resets the input value onClick', () => {
      const input = mountWrapper.find('.wfp--visually-hidden');
      input.instance().value = '';
      const evt = { target: { value: input.instance().value } };
      input.simulate('click', evt);

      expect(evt.target.value).toEqual(null);
    });
  });

  describe('Unique id props', () => {
    it('each FileUploaderButton should have a unique ID', () => {
      const mountedButtons = mount(
        <div>
          <FileUploaderButton className="extra-class" />
          <FileUploaderButton className="extra-class" />
        </div>
      );
      const firstButton = mountedButtons.find(FileUploaderButton).at(0);
      const lastButton = mountedButtons.find(FileUploaderButton).at(1);
      const isEqual = firstButton === lastButton;
      expect(isEqual).toBe(false);
    });
  });

  describe('Update labelText', () => {
  //   it('should have equal state and props', () => {
  //     expect(
  //       shallow(<FileUploaderButton labelText="foo" />).state().labelText
  //     ).toEqual('foo');
  //   });

    // it('should change the label text upon change in props', () => {
    //   mountWrapper.setProps({ labelText: 'foo' });
    //   mountWrapper.setState({ labelText: 'foo' });
    //   mountWrapper.setProps({ labelText: 'bar' });
    //   expect(mountWrapper.state().labelText).toEqual('bar');
    // });

    // it('should avoid change the label text upon setting props, unless there the value actually changes', () => {
    //   mountWrapper.setProps({ labelText: 'foo' });
    //   mountWrapper.setState({ labelText: 'bar' });
    //   mountWrapper.setProps({ labelText: 'foo' });
    //   expect(mountWrapper.state().labelText).toEqual('bar');
    // });
  });

describe('FileUploader', () => {
  const fileUploader = <FileUploader className="extra-class" />;
  const mountWrapper = mount(fileUploader);

  // describe('Renders as expected with defaults', () => {
  //   it('should render with default className', () => {
  //     expect(mountWrapper.children().hasClass('wfp--form-item')).toEqual(true);
  //   });

    it('should render with given className', () => {
      expect(mountWrapper.hasClass('extra-class')).toEqual(true);
    });

    it('renders with FileUploaderButton with disableLabelChanges set to true', () => {
      expect(
        mountWrapper.find('FileUploaderButton').props().disableLabelChanges
      ).toEqual(true);
    });
    // it('renders input with hidden prop', () => {
    //   expect(mountWrapper.find('input').props().className).toEqual(
    //     'wfp--visually-hidden'
    //   );
    // });
    it('renders with empty div.wfp--file-container by default', () => {
      expect(mountWrapper.find('div.wfp--file-container').text()).toEqual('');
    });
    /*it('clears all uploaded files when the clearFiles method is called', () => {
      const mountUploadedWrapper = mount(fileUploader);
      mountUploadedWrapper.setState({
        filenames: ['examplefile.jpg'],
        filenameStatus: 'complete',
      });

      // Test to make sure that the Filename is rendered
      expect(mountUploadedWrapper.find(Filename)).toHaveLength(1);

      // Test to make sure it was properly removed
      mountUploadedWrapper.instance().clearFiles();
      expect(mountUploadedWrapper.update().find(Filename)).toHaveLength(0);
    });*/
  });

  describe('Update filenameStatus', () => {
    // it('should have equal state and props', () => {
    //   expect(
    //     shallow(<FileUploader filenameStatus="uploading" />).state()
    //       .filenameStatus
    //   ).toEqual('uploading');
    // });

    // it('should change the label text upon change in props', () => {
    //   mountWrapper.setProps({ filenameStatus: 'uploading' });
    //   // mountWrapper.setState({ filenameStatus: 'uploading' });
    //   mountWrapper.setProps({ filenameStatus: 'edit' });
    //   expect(mountWrapper.state().filenameStatus).toEqual('edit');
    // });

    // it('should avoid change the label text upon setting props, unless there the value actually changes', () => {
    //   mountWrapper.setProps({ filenameStatus: 'uploading' });
    //   mountWrapper.setState({ filenameStatus: 'edit' });
    //   mountWrapper.setProps({ filenameStatus: 'uploading' });
    //   expect(mountWrapper.state().filenameStatus).toEqual('edit');
    // });
  });
});

describe('FileUploaderSkeleton', () => {
  describe('Renders as expected', () => {
    const wrapper = shallow(<FileUploaderSkeleton />);

    it('Has the expected classes', () => {
      expect(wrapper.hasClass('wfp--form-item')).toEqual(true);
    });
  });
});
