import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import * as BooksAPI from './BooksAPI';
import Singlebook from './Singlebook';

class BookSearch extends Component {
	state = {
		query: '',
		searchBooks: [],
		isSearching: false
	};

	updateQuery = e => {
		this.setState({ query: e.target.value }, () => {
			this.searchBooks(e);
		});
	};

	searchBooks = e => {
		if (this.state.query) {
			this.setState({ isSearching: true });
			BooksAPI.search(this.state.query).then(res => {
				if (res.error) {
					this.setState({ searchBooks: [] });
				} else if (res) {
					this.updateBooks(res);
				}
			});
		} else {
			this.setState({ searchBooks: [] });
		}
	};

	updateBooks = books => {
		const searchedBooks = books;
		for (const book of searchedBooks) {
			book.shelf = 'none';
			for (const shelvedBook of this.props.shelvedBooks) {
				if (book.id === shelvedBook.id) book.shelf = shelvedBook.shelf;
			}
		}

		this.setState({
			searchBooks: searchedBooks,
			isSearching: false
		});
	}; 

	updateBook = books => {
		const {searchBooks} = this.state;
		for (const book of searchBooks) {
			for (const shelvedBook of books) {
				if (book.id === shelvedBook.id) book.shelf = shelvedBook.shelf;
			}
		}

		this.setState({ searchBooks });
	};

	changeShelf = (book, e) => {
		this.props.onChangeShelf(book, e).then(books => this.updateBook(books));
	};

	render() {
		const { searchBooks } = this.state;

		return (
			<div className="search-books">
				<div className="search-books-bar">
					<Link to="/" className="close-search">
						Close
					</Link>
					<div className="search-books-input-wrapper">
						<input
							type="text"
							value={this.state.query}
							placeholder="Search by title or author"
							onChange={e => this.updateQuery(e)}
						/>
					</div>
				</div>
				{this.state.isSearching ? (
					<div className="loader" />
				) : (
					<div className="search-books-results">
						<ol className="books-grid">
							{searchBooks.map(book => (
								<Singlebook key={book.id} book={book} onChangeShelf={this.changeShelf} />
							))}
						</ol>
					</div>
				)}
			</div>
		);
	}
}

BookSearch.propTypes = {
	shelvedBooks: PropTypes.array.isRequired,
	onChangeShelf: PropTypes.func.isRequired
};

export default BookSearch;
