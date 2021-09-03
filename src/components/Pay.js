import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

import Tezos from "../assets/tezos.png";
import "../css/pay.css";

const Pay = ({ senderStreams }) => {
	const selector = useSelector((state) => {
		return state.walletConfig.user;
	});
	const dispatch = useDispatch();

	return (
		<div className="container">
			{selector.userAddress === "" ? (
				<div className="container container-content main-section">
					<div className="col main" align="center">
						<div className="sign-in-text">
							Connect Wallet to get started!
						</div>
					</div>
				</div>
			) : (
				<div>
					{senderStreams === null ? (
						<div className="col container-content" align="center">
							<div style={{ padding: "10px" }}>
								<div
									style={{
										width: "300px",
										marginRight: "auto",
									}}
								>
									<Skeleton />
								</div>
								<Skeleton count={3} />
								<div
									style={{
										width: "500px",
										marginRight: "auto",
									}}
								>
									<Skeleton />
								</div>
							</div>
						</div>
					) : (
						<div>
							{senderStreams.length === 0 ? (
								<div className="container container-content main-section">
									<div className="col main" align="center">
										<div className="sign-in-text">
											Create stream to get started
										</div>
										<Link
											to="/createstream"
											className="btn create-stream-btn"
										>
											Create Stream
										</Link>
									</div>
								</div>
							) : (
								<div className="row container-content">
									<div className="table-section">
										<div className="row">
											<div className="pay-flex">
												<h3 className="pay-dash-head">
													Dashboard
												</h3>
												<Link
													to="/createstream"
													className="btn top-create-btn"
												>
													Create Stream
												</Link>
											</div>
										</div>
										<div className="col" align="center">
											<div className="table-responsive">
												<table className="table table-light table-borderless">
													<thead>
														<tr className="dash-head">
															<th
																scope="col"
																className="dash-table-header"
															>
																STATUS
															</th>
															<th
																scope="col"
																className="dash-table-header"
															>
																TO
															</th>
															<th
																scope="col"
																className="dash-table-header"
															>
																DEPOSIT
															</th>
															<th
																scope="col"
																className="dash-table-header"
															>
																START TIME
															</th>
															<th
																scope="col"
																className="dash-table-header"
															>
																STOP TIME
															</th>
														</tr>
													</thead>
													<tbody className="dash-body">
														{senderStreams.map(
															(stream) => {
																console.log(
																	stream
																);
																return (
																	<tr className="dash-row">
																		{stream.isActive ? (
																			<td>
																				<Link
																					to={
																						"/stream/" +
																						stream.streamId
																					}
																					className="streaming"
																				>
																					Streaming
																				</Link>
																			</td>
																		) : (
																			<td>
																				<Link
																					to={
																						"/stream/" +
																						stream.streamId
																					}
																					className="cancelled"
																				>
																					Cancelled
																				</Link>
																			</td>
																		)}
																		<td className="receiver">
																			<a
																				target="_blank"
																				href={
																					"https://granadanet.tzkt.io/" +
																					stream.receiver +
																					"/operations"
																				}
																			>
																				{
																					stream.receiver
																				}
																			</a>
																		</td>
																		<td>
																			<img
																				src={
																					Tezos
																				}
																				className="tezos-icon"
																			/>
																			{stream.deposit /
																				1000000}
																		</td>
																		<td className="dash-table-body">
																			{new Date(
																				Date.parse(
																					stream.startTime
																				)
																			).toDateString() +
																				" " +
																				new Date(
																					Date.parse(
																						stream.startTime
																					)
																				)
																					.toTimeString()
																					.split(
																						" GMT"
																					)[0]}
																		</td>
																		<td className="dash-table-body">
																			{new Date(
																				Date.parse(
																					stream.stopTime
																				)
																			).toDateString() +
																				" " +
																				new Date(
																					Date.parse(
																						stream.stopTime
																					)
																				)
																					.toTimeString()
																					.split(
																						" GMT"
																					)[0]}
																		</td>
																	</tr>
																);
															}
														)}
													</tbody>
												</table>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

// sender streams

export default Pay;
