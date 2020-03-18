import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat'
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote'
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold'
import Heading from '@ckeditor/ckeditor5-heading/src/heading'
import Image from '@ckeditor/ckeditor5-image/src/image'
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption'
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle'
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar'
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload'
import Indent from '@ckeditor/ckeditor5-indent/src/indent'
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic'
import List from '@ckeditor/ckeditor5-list/src/list'
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed'
import Table from '@ckeditor/ckeditor5-table/src/table'
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar'
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment'
import Autosave from '@ckeditor/ckeditor5-autosave/src/autosave'
import Code from '@ckeditor/ckeditor5-basic-styles/src/code'
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock'
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor'
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor'
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize'
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily'
import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight'
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline'
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize'
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock'
import MediaEmbedToolbar from '@ckeditor/ckeditor5-media-embed/src/mediaembedtoolbar'
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat'
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough'
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript'
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript'
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline'
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials'
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import SimpleBase64UploadAdapter from 'ckeditor5-simple-base64-upload-adapter'
import Latex from 'ckeditor5-latex'

export default class Editor extends ClassicEditor {}

Editor.builtinPlugins = [
	Autoformat,
	BlockQuote,
	Bold,
	Heading,
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Indent,
	Italic,
	List,
	MediaEmbed,
	Table,
	TableToolbar,
	Alignment,
	Autosave,
	SimpleBase64UploadAdapter,
	Code,
	CodeBlock,
	FontBackgroundColor,
	FontColor,
	FontSize,
	FontFamily,
	Highlight,
	HorizontalLine,
	ImageResize,
	IndentBlock,
	MediaEmbedToolbar,
	RemoveFormat,
	Strikethrough,
	Superscript,
	Subscript,
	Underline,
	Essentials,
	Paragraph,
	Latex
]

Editor.defaultConfig = {
	language: 'en',
	toolbar: {
		items: [
			'heading',
			'|',
			'bold',
			'italic',
			'underline',
			'strikethrough',
			'numberedList',
			'bulletedList',
			'horizontalLine',
			'|',
			'alignment',
			'fontColor',
			'fontBackgroundColor',
			'fontSize',
			'fontFamily',
			'|',
			'imageUpload',
			'insertTable',
			'codeBlock',
			'code',
			'inlineLatex',
			'centeredLatex',
			'|',
			'indent',
			'outdent',
			'superscript',
			'subscript',
			'blockQuote',
			'removeFormat',
			'undo',
			'redo'
		]
	},
	image: {
		toolbar: [
			'imageTextAlternative',
			'imageStyle:full',
			'imageStyle:side'
		],
		types: [
			'jpeg',
			'png',
			'gif',
			'bmp',
			'webp',
			'tiff',
			'heic'
		]
	},
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells'
		]
	}
}
