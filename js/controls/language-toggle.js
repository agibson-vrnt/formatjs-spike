/*eslint-env browser*/

import React from "react";

var PropTypes = React.PropTypes;

class LanguageToggle extends React.Component {

    constructor() {

        super();
        this.state = {};

    }

    handleClick( e ) {

        if( !this.state.isOpen ) {

            e.preventDefault();
            this.setState( { isOpen: true } );

        }

    }

    renderLinkToLocale( locale ) {

        return <li key={locale.code}
                   className={"loc-selector loc-selector-" + locale.code + (locale.isSelected ? " loc-selector-selected" : "" )}>

            <a href={locale.url}
               onClick={e => this.handleClick(e)}>
               <span className="loc-selector-name">{locale.displayName}</span>
            </a>

        </li>;

    }

    handleClickOut( e ) {

        var node = e.target;
        while( ( node !== this.refs.picker ) && node.parentElement ) { node = node.parentElement; }
        if( node !== this.refs.picker && this.state.isOpen ) {

            this.setState( { isOpen: false } );

        }

    }

    componentDidMount() {

        document.addEventListener( "click", e => this.handleClickOut( e ), true );

    }

    componentWillUnmount() {

        document.removeEventListener( "click", e => this.handleClickOut( e ), true );

    }

    render() {

        var locales = this.props.locales.sort( (a, b) =>

            (a.displayName > b.displayName) ? 1 : ( (a.displayName < b.displayName) ? -1 : 0 )

        );
        var controlClass = "language-toggle-control" + ( this.state.isOpen ? " language-toggle-control-open" : "" );
        return <ul ref="picker" className={controlClass}>{locales.map( locale => this.renderLinkToLocale( locale ) )}</ul>;

    }

}
LanguageToggle.propTypes = {

    locales: PropTypes.array.isRequired,
    fullUrl: PropTypes.string.isRequired

};

export default LanguageToggle;
