function camel2Dash(_str) {
    const str = _str[0].toLowerCase() + _str.substr(1);
    return str.replace(/([A-Z])/g, ($1) => `-${$1.toLowerCase()}`);
}

module.exports = function core (defaultLibraryName) {
	return ({ types }) => ({
		visitor: {
			ImportDeclaration (path) {
				const specifiers = path.node.specifiers;
				const source = path.node.source;

				if (defaultLibraryName !== source.value) return;

				const sourceName = (componentName) => {
					// @dp/bee-ui @0.1.1
					let name = camel2Dash(componentName);
					if (name === 'bee-option') {
						return `@dp/bee-ui/src/components/ui-base/select/${name}`;
					}
					if (name.startsWith('bee-')) {
						return `@dp/bee-ui/src/components/ui-base/${name.substr(4)}/${name}`;
					}
					if (['radio', 'radio-button', 'radio-group'].includes(name)) {
						return `@dp/bee-ui/src/components/ui-base/radio/bee-${name}`;
					}
					if (['checkbox', 'checkbox-button', 'checkbox-group'].includes(name)) {
						return `@dp/bee-ui/src/components/ui-base/checkbox/bee-${name}`;
					}
					if (name === 'date-combine-range-picker') {
						name = 'dateCombine-range-picker';
					}
					if (name === 'tipsover') {
						return '@dp/bee-ui/src/components/ui-base/tipsover/tipsover-theme';
					}
					if (name === 'loading' || name === 'toast') {
						return `@dp/bee-ui/src/components/ui-base/${name}/index.js`;
					}
					return `@dp/bee-ui/src/components/ui-base/${name}/${name}`;
				};

				if (!types.isImportDefaultSpecifier(specifiers[0])) {
					const declarations = specifiers.map((specifier) =>
						types.ImportDeclaration([types.ImportDefaultSpecifier(specifier.local)],
							types.StringLiteral(sourceName(specifier.local.name))));
					path.replaceWithMultiple(declarations);
				}
			}
		}
	});
};
