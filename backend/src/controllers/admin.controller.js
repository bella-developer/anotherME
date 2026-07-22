import User from '../models/User.model.js';
import Post from '../models/Post.model.js';
import Circle from '../models/Circle.model.js';
import Comment from '../models/Comment.model.js';
import { createSuccessResponse } from '../utils/response.utils.js';

/**
 * Admin Controller
 * Get platform statistics and analytics
 */

/**
 * GET /api/admin/stats
 * Get comprehensive platform statistics
 */
export async function getStatistics(req, res, next) {
  try {
    // Verify admin access
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      const error = new Error('Access denied. Admin privileges required.');
      error.statusCode = 403;
      error.code = 'ADMIN_ACCESS_DENIED';
      throw error;
    }

    // Calculate date ranges
    const now = new Date();
    const last24h = new Date(now - 24 * 60 * 60 * 1000);
    const last7d = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now - 30 * 24 * 60 * 60 * 1000);

    // User Statistics
    const totalUsers = await User.countDocuments();
    const newUsersLast24h = await User.countDocuments({ createdAt: { $gte: last24h } });
    const newUsersLast7d = await User.countDocuments({ createdAt: { $gte: last7d } });
    const newUsersLast30d = await User.countDocuments({ createdAt: { $gte: last30d } });
    
    // Gender distribution
    const maleUsers = await User.countDocuments({ gender: 'male' });
    const femaleUsers = await User.countDocuments({ gender: 'female' });
    const otherGender = totalUsers - maleUsers - femaleUsers;

    // Post Statistics
    const totalPosts = await Post.countDocuments();
    const postsLast24h = await Post.countDocuments({ createdAt: { $gte: last24h } });
    const postsLast7d = await Post.countDocuments({ createdAt: { $gte: last7d } });
    const postsLast30d = await Post.countDocuments({ createdAt: { $gte: last30d } });
    
    // Posts with images
    const postsWithImages = await Post.countDocuments({ 'image.url': { $exists: true, $ne: null } });

    // Room Statistics
    const darkRoomPosts = await Post.countDocuments({ room: 'dark' });
    const fantasyRoomPosts = await Post.countDocuments({ room: 'fantasy' });
    const philoRoomPosts = await Post.countDocuments({ room: 'philo' });

    // Circle Statistics
    const totalCircles = await Circle.countDocuments();
    const darkRoomCircles = await Circle.countDocuments({ room: 'dark' });
    const fantasyRoomCircles = await Circle.countDocuments({ room: 'fantasy' });
    const philoRoomCircles = await Circle.countDocuments({ room: 'philo' });

    // Comment Statistics
    const totalComments = await Comment.countDocuments();
    const commentsLast24h = await Comment.countDocuments({ createdAt: { $gte: last24h } });
    const commentsLast7d = await Comment.countDocuments({ createdAt: { $gte: last7d } });
    const commentsLast30d = await Comment.countDocuments({ createdAt: { $gte: last30d } });

    // Engagement Statistics
    const allPosts = await Post.find().select('reactions');
    const totalReactions = allPosts.reduce((sum, post) => {
      const postReactions = Object.values(post.reactions || {}).reduce((a, b) => a + b, 0);
      return sum + postReactions;
    }, 0);

    const allComments = await Comment.find().select('reactions');
    const totalCommentReactions = allComments.reduce((sum, comment) => {
      const commentReactions = Object.values(comment.reactions || {}).reduce((a, b) => a + b, 0);
      return sum + commentReactions;
    }, 0);

    // Calculate engagement rate
    const totalEngagement = totalReactions + totalCommentReactions + totalComments;
    const engagementRate = totalPosts > 0 ? (totalEngagement / totalPosts).toFixed(2) : 0;

    // Top categories
    const categoryStats = await Post.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Most active users (by posts)
    const mostActiveUsers = await Post.aggregate([
      { $group: { _id: '$authorId', postCount: { $sum: 1 } } },
      { $sort: { postCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          username: '$user.username',
          postCount: 1
        }
      }
    ]);

    // Room engagement comparison
    const roomEngagement = [
      {
        room: 'dark',
        posts: darkRoomPosts,
        circles: darkRoomCircles,
        comments: await Comment.countDocuments({
          circleId: { $in: await Circle.find({ room: 'dark' }).distinct('_id') }
        })
      },
      {
        room: 'fantasy',
        posts: fantasyRoomPosts,
        circles: fantasyRoomCircles,
        comments: await Comment.countDocuments({
          circleId: { $in: await Circle.find({ room: 'fantasy' }).distinct('_id') }
        })
      },
      {
        room: 'philo',
        posts: philoRoomPosts,
        circles: philoRoomCircles,
        comments: await Comment.countDocuments({
          circleId: { $in: await Circle.find({ room: 'philo' }).distinct('_id') }
        })
      }
    ];

    // Response
    const stats = {
      users: {
        total: totalUsers,
        new24h: newUsersLast24h,
        new7d: newUsersLast7d,
        new30d: newUsersLast30d,
        gender: {
          male: maleUsers,
          female: femaleUsers,
          other: otherGender,
          malePercentage: totalUsers > 0 ? ((maleUsers / totalUsers) * 100).toFixed(1) : 0,
          femalePercentage: totalUsers > 0 ? ((femaleUsers / totalUsers) * 100).toFixed(1) : 0,
          otherPercentage: totalUsers > 0 ? ((otherGender / totalUsers) * 100).toFixed(1) : 0
        }
      },
      posts: {
        total: totalPosts,
        new24h: postsLast24h,
        new7d: postsLast7d,
        new30d: postsLast30d,
        withImages: postsWithImages,
        imagePercentage: totalPosts > 0 ? ((postsWithImages / totalPosts) * 100).toFixed(1) : 0
      },
      circles: {
        total: totalCircles,
        byRoom: {
          dark: darkRoomCircles,
          fantasy: fantasyRoomCircles,
          philo: philoRoomCircles
        }
      },
      comments: {
        total: totalComments,
        new24h: commentsLast24h,
        new7d: commentsLast7d,
        new30d: commentsLast30d
      },
      engagement: {
        totalReactions: totalReactions + totalCommentReactions,
        postReactions: totalReactions,
        commentReactions: totalCommentReactions,
        engagementRate: parseFloat(engagementRate),
        averageCommentsPerPost: totalPosts > 0 ? (totalComments / totalPosts).toFixed(2) : 0
      },
      rooms: roomEngagement,
      topCategories: categoryStats,
      mostActiveUsers: mostActiveUsers,
      timestamp: new Date().toISOString()
    };

    res.status(200).json(
      createSuccessResponse(stats, 'Statistics retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
}
