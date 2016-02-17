import React from "react";
import LanguageToggle from "./language-toggle";

var PropTypes = React.PropTypes;

class UserHeader extends React.Component {

	handleLocaleChange( e ) {

		// we might do something to mutate the state on the client-side, but for purposes of this demo, just submit the form
		e.target.parentElement.submit();

	}

	render() {

		return <section className="user-header-control">
			<LanguageToggle {...this.props} />
			<span>{this.props.i18n[ "you-have-N-messages" ]}</span>
			<form method="POST" action="/logout"><button>{this.props.i18n[ "Log out" ]}</button></form>
		</section>;

	}

}
UserHeader.propTypes = {

	locales: PropTypes.array.isRequired,
	i18n: PropTypes.object.isRequired

};

export default UserHeader;
