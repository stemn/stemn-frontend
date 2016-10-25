import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './ProgressButton.css';


export const AnimateSvg = React.createClass({
  svgEl: '',
  render() {
    const { children, draw } = this.props;
    const newProps = {
      ref: 'svg'
    };
    if(!this.svgEl && this.refs.svg){
      this.svgEl = new SVGEl(this.refs.svg)
    }
    if(this.svgEl){
      this.svgEl.draw(draw)
    }
    return React.cloneElement(children, newProps)
  }
});

export default React.createClass({
  getInitialState () {
    return {
      status: '',
      disabled: false,
      drawLoading: 0,
      drawSuccess: 0,
    }
  },
  componentWillReceiveProps(nextProps) {
    const prevProps = this.props;

    // If we just began loading:
    if(nextProps.loading && (!prevProps || !prevProps.loading)){
      this.startLoading();
    }
    // If we finished loading
    else if(prevProps && prevProps.loading && !nextProps.loading){
      this.loadingComplete();
    }
  },
  partialLoadTimeout: null,
  successTimeout: null,
  successIconTimeout: null,
  resetTimeout: null,
  clearTimeouts() {
    clearTimeout(this.partialLoadTimeout);
    clearTimeout(this.successTimeout);
    clearTimeout(this.successIconTimeout);
    clearTimeout(this.resetTimeout);
  },
  componentWillUnmount(){
    this.clearTimeouts();
  },
  startLoading() {
    this.clearTimeouts();
    this.setState({
      status: 'loading',
      disabled: true ,
      drawLoading: 0,
      drawSuccess: 0
    });
    this.partialLoadTimeout = setTimeout(()=>{this.setState({drawLoading: 0.7})}, 100);
  },
  loadingComplete() {
    this.clearTimeouts();
    this.setState({ drawLoading: 1 });

    this.successTimeout = setTimeout(() => {
      this.setState({ status: 'success'});
      this.successIconTimeout = setTimeout(() => {
        this.setState({drawSuccess: 1})
      }, 100)
      this.resetTimeout = setTimeout(() => {
        this.setState({ status: '', disabled: false, drawLoading: 0 });
      }, 2000)
    }, 700)
  },
  render() {
    const { children, onClick, loading, className } = this.props;
    const { status, disabled, drawLoading, drawSuccess } = this.state;


    const Progress = (
      <svg className={classes.progressCircle} width="40" height="40" viewBox="0 0 40 40">
        <path d="m1.5,20c0,-10.22099 8.27901,-18.5 18.5,-18.5c10.22099,0 18.5,8.27901 18.5,18.5c0,10.22099 -8.27901,18.5 -18.5,18.5c-10.22099,0 -18.5,-8.27901 -18.5,-18.5z"/>
      </svg>
    )
    const Checkmark = (
      <svg className={classes.checkmark} width="40" height="40" viewBox="0 0 70 70">
        <path d="m31.5,46.5l15.3,-23.2"/>
        <path d="m31.5,46.5l-8.5,-7.1"/>
      </svg>
    )
    const Cross = (
      <svg className={classes.cross} width="40" height="40" viewBox="0 0 70 70">
        <path d="m35,35l-9.3,-9.3"/>
        <path d="m35,35l9.3,9.3"/>
        <path d="m35,35l-9.3,9.3"/>
        <path d="m35,35l9.3,-9.3"/>
      </svg>
    )

    return (
      <div className={classNames(
          classes.progressButton, className,
          {[classes.loading] : status == 'loading'},
          {[classes.error]   : status == 'error'},
          {[classes.success] : status == 'success'},
        )}>
        <button onClick={() => {if(!disabled){onClick()}}}><span>{children}</span></button>
        <AnimateSvg draw={drawLoading}>{Progress}</AnimateSvg>
        <AnimateSvg draw={drawSuccess}>{Checkmark}</AnimateSvg>
        <AnimateSvg>{Cross}</AnimateSvg>
      </div>
    );
  }
});


////////////////////////////////////////////////////////////

function SVGEl( el ) {
  this.el = el;
  // the path elements
  this.paths = [].slice.call( this.el.querySelectorAll( 'path' ) );
  // we will save both paths and its lengths in arrays
  this.pathsArr = new Array();
  this.lengthsArr = new Array();
  this._init();
}

SVGEl.prototype._init = function() {
  var self = this;
  this.paths.forEach( function( path, i ) {
    self.pathsArr[i] = path;
    path.style.strokeDasharray = self.lengthsArr[i] = path.getTotalLength();
  } );
  // undraw stroke
  this.draw(0);
}

SVGEl.prototype.draw = function( val ) {
  for( var i = 0, len = this.pathsArr.length; i < len; ++i ){
    this.pathsArr[ i ].style.strokeDashoffset = this.lengthsArr[ i ] * ( 1 - val );
  }
}
